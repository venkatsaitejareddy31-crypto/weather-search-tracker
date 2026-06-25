import { useEffect, useState } from "react";
import { fetchHistory, fetchWeather } from "./api";

const initialCity = "London";

function formatTime(time) {
  if (!time) {
    return "Current";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(time));
}

export default function App() {
  const [searchValue, setSearchValue] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      const data = await fetchHistory();
      setHistory(data.history || []);
    } catch (historyError) {
      setError(historyError.message);
    }
  }

  async function loadWeather(cityName) {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchWeather(cityName);
      setWeather(data.weather);
      setHistory(data.history || []);
      setSearchValue(data.weather.city);
    } catch (weatherError) {
      setError(weatherError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    loadWeather(initialCity);
  }, []);

  return (
    <div className="app-shell">
      <main className="layout">
        <section className="hero">
          <p className="eyebrow">Weather Search History Tracker</p>
          <h1>Search weather and keep your recent cities ready to click.</h1>
          <p className="lead">
            A tiny MERN stack app with a backend that remembers city searches and a
            simple React weather dashboard.
          </p>

          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              loadWeather(searchValue);
            }}
          >
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Enter a city"
              aria-label="City"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error ? <p className="error">{error}</p> : null}

          {weather ? (
            <article className="weather-card">
              <div>
                <span className="label">Current city</span>
                <h2>
                  {weather.city}
                  {weather.country ? `, ${weather.country}` : ""}
                </h2>
                <p className="muted">
                  {weather.region ? `${weather.region} • ` : ""}
                  Updated {formatTime(weather.time)}
                </p>
              </div>

              <div className="weather-grid">
                <div>
                  <span className="label">Temperature</span>
                  <strong>{weather.temperature ?? "--"}°C</strong>
                </div>
                <div>
                  <span className="label">Wind</span>
                  <strong>{weather.windSpeed ?? "--"} km/h</strong>
                </div>
                <div className="wide">
                  <span className="label">Condition</span>
                  <strong>{weather.description}</strong>
                </div>
              </div>
            </article>
          ) : null}
        </section>

        <aside className="sidebar">
          <h3>Recent Cities</h3>
          {history.length ? (
            <ul className="history-list">
              {history.map((entry) => (
                <li key={entry.city}>
                  <button
                    type="button"
                    onClick={() => loadWeather(entry.city)}
                    className="history-button"
                  >
                    <span>{entry.city}</span>
                    <small>{entry.count} search{entry.count > 1 ? "es" : ""}</small>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Search a city to start building history.</p>
          )}

          <div className="tip">
            <h4>How it works</h4>
            <p>Searching a city calls the backend, fetches weather, and saves the city.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

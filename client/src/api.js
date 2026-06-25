export async function fetchHistory() {
  const response = await fetch("/api/history");
  if (!response.ok) {
    throw new Error("Unable to load recent cities");
  }
  return response.json();
}

export async function fetchWeather(city) {
  const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Unable to load weather");
  }

  return payload;
}

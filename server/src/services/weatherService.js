const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm"
};

function createApiError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function getWeatherByCity(city) {
  const locationResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const locationData = await locationResponse.json();

  if (!locationData.results?.length) {
    throw createApiError(`No weather location found for "${city}"`, 404);
  }

  const location = locationData.results[0];
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`
  );
  const weatherData = await weatherResponse.json();

  return {
    city: location.name,
    country: location.country,
    region: location.admin1 || "",
    latitude: location.latitude,
    longitude: location.longitude,
    temperature: weatherData.current?.temperature_2m ?? null,
    windSpeed: weatherData.current?.wind_speed_10m ?? null,
    weatherCode: weatherData.current?.weather_code ?? null,
    description:
      weatherDescriptions[weatherData.current?.weather_code] || "Unknown weather",
    time: weatherData.current?.time ?? null
  };
}

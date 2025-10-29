// Weather API configuration
// Vite exposes env variables via import.meta.env and only those prefixed with VITE_ are exposed to the client.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Fetch current weather for a location
export async function fetchWeather({ lat, lon }) {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Weather fetch failed');
  return response.json();
}

// Fetch 5-day forecast for a location
export async function fetchForecast({ lat, lon }) {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Forecast fetch failed');
  return response.json();
}

// Search for locations by name
export async function searchLocations(query) {
  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Location search failed');
  return response.json();
}
import { useState, useEffect } from 'react';
import LocationPicker from './LocationPicker';
import WeatherSummary from './WeatherSummary';
import { fetchWeather, fetchForecast } from '../services/weatherApi';

function WeatherPanel({ location, onLocationChange }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!location?.lat || !location?.lon) return;
      
      setLoading(true);
      try {
        const [weather, forecast] = await Promise.all([
          fetchWeather(location),
          fetchForecast(location)
        ]);
        
        if (isMounted) {
          setCurrentWeather(weather);
          setForecast(forecast);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        if (isMounted) {
          setError(error.message || 'Failed to fetch weather');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [location?.lat, location?.lon]);

  if (loading) return <div className="weather-loading">Loading weather...</div>;

  return (
    <div className="weather-container">
      <div className="current-weather">
        <LocationPicker 
          location={location} 
          onLocationChange={onLocationChange}
          currentLocation={currentWeather?.name}
          onSearchingChange={setIsSearching}
        />
        {currentWeather ? (
          <div className="weather-now">
            <img
              src={`/weather-icons/${currentWeather.weather[0].icon}.png`}
              alt={currentWeather.weather[0].description}
              className="weather-icon"
              onError={(e) => {
                // Fallback to OpenWeather CDN if local icon not present
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
              }}
            />
            <div className="weather-now-details">
              <div className="weather-temp">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <div className="weather-desc">
                {currentWeather.weather[0].description}
              </div>
            </div>
          </div>
        ) : (
          <div className="weather-empty">
            {error ? (
              <div className="weather-error">Weather unavailable: {error}</div>
            ) : (
              <div className="weather-hint">No weather data. Search a location or allow geolocation.</div>
            )}
          </div>
        )}
      </div>
      {forecast && !isSearching && <WeatherSummary forecast={forecast} />}
    </div>
  );
}

export default WeatherPanel;
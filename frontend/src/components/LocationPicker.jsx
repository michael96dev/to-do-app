import { useState, useEffect, useRef, memo } from 'react';
import { searchLocations } from '../services/weatherApi';

function LocationPicker({ location, onLocationChange, currentLocation, onSearchingChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mounted ref for async callbacks
  const mountedRef = useRef(true);

  const getUserLocation = async () => {
    if (!("geolocation" in navigator)) {
      console.error('Geolocation is not supported');
      return;
    }

    if (mountedRef.current) {
      setIsLoading(true);
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      if (!mountedRef.current) return;

      const { latitude: lat, longitude: lon } = position.coords;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const [locationData] = await response.json();

        if (!mountedRef.current) return;

        onLocationChange({
          lat,
          lon,
          name: locationData?.name || 'Current Location',
          country: locationData?.country || ''
        });
      } catch (error) {
        console.error('Error getting location name:', error);
        if (mountedRef.current) {
          onLocationChange({ lat, lon, name: 'Current Location' });
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Only request geolocation on initial mount
  useEffect(() => {
    mountedRef.current = true;
    if (!location?.lat || !location?.lon) {
      getUserLocation();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []); // Empty dependency array ensures it only runs on mount

  const handleSearch = (query) => {
    setSearch(query);
  };

  // Handle search with debounce
  useEffect(() => {
    let timeoutId;

    const performSearch = async () => {
      if (search.length >= 3) {
        try {
          const results = await searchLocations(search);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching locations:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    timeoutId = setTimeout(performSearch, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  return (
    <div className={`location-controls ${isOpen ? 'searching' : ''}`}>
      <div className="current-location">
        <span>{isLoading ? 'Getting location...' : (currentLocation || 'Select location')}</span>
        <div className="location-controls-buttons">
          <button
            className="home-button"
            onClick={getUserLocation}
            title="Return to my location"
            disabled={isLoading}
          >
            🏠
          </button>
          <button
            className="city-button"
            onClick={() => {
              const next = !isOpen;
              setIsOpen(next);
              if (onSearchingChange) onSearchingChange(next);
            }}
            title="Change city"
          >
            {isOpen ? '✕' : '🏙️ City'}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="location-search-container">
          <div className="search-header">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter city name..."
              className="location-search"
              autoFocus
            />
            <button 
              className="search-close-button"
              onClick={() => {
                setIsOpen(false);
                setSearch('');
                if (onSearchingChange) onSearchingChange(false);
              }}
              title="Close search"
            >
              ✕
            </button>
          </div>
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  key={`${result.lat}-${result.lon}`}
                  className="location-option"
                  onClick={() => {
                    onLocationChange(result);
                    setIsOpen(false);
                    setSearch('');
                    if (onSearchingChange) onSearchingChange(false);
                  }}
                >
                  {result.name}, {result.country}
                </button>
              ))
            ) : search.length >= 3 ? (
              <div className="no-results">No cities found</div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}


export default memo(LocationPicker);
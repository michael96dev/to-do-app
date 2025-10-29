function WeatherSummary({ forecast }) {
  // Group forecast by day and get daily summaries
  const dailyForecasts = forecast.list.reduce((days, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!days[date]) {
      days[date] = {
        temp: item.main.temp,
        weather: item.weather[0],
        icon: item.weather[0].icon,
        date: new Date(item.dt * 1000)
      };
    }
    return days;
  }, {});

  return (
    <div className="weather-summary">
      <h3 className="visually-hidden">Weekly Forecast</h3>
      <div className="forecast-row" aria-label="Weekly forecast">
        {Object.values(dailyForecasts).map((day) => {
          const shortDay = day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,3);
          return (
            <div key={day.date.toISOString()} className="forecast-day">
              <div className="day-name">{shortDay}</div>
              <div className="forecast-details">
                <img
                  src={`/weather-icons/${day.icon}.png`}
                  alt={day.weather.description}
                  className="forecast-icon"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
                  }}
                />
                <div className="forecast-temp">{Math.round(day.temp)}°C</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default WeatherSummary;
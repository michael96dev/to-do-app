function WeatherSummary({ forecast }) {
  // Group forecast by day and get daily summaries (first entry per calendar day)
  const dailyMap = forecast.list.reduce((days, item) => {
    const d = new Date(item.dt * 1000);
    const dateKey = d.toLocaleDateString();
    if (!days[dateKey]) {
      days[dateKey] = {
        temp: item.main.temp,
        weather: item.weather[0],
        icon: item.weather[0].icon,
        date: d,
      };
    }
    return days;
  }, {});

  const todayKey = new Date().toLocaleDateString();
  const nextSixDays = Object.values(dailyMap)
    .sort((a, b) => a.date - b.date)
    .filter((d) => d.date.toLocaleDateString() !== todayKey)
    .slice(0, 6);

  return (
    <div className="weather-summary" aria-label="Weekly forecast">
      {nextSixDays.map((day) => {
        const shortDay = day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
        return (
          <div key={day.date.toISOString()} className="forecast-day">
            <div className="date">{shortDay}</div>
            <img
              src={`/weather-icons/${day.icon}.png`}
              alt={day.weather.description}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
              }}
            />
            <div className="temp-range">{Math.round(day.temp)}°C</div>
          </div>
        );
      })}
    </div>
  );
}

export default WeatherSummary;
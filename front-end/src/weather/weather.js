import React, { useState } from 'react';
import './weather.css';

function Weather() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [error, setError] = useState('');

    const apiKey = '60eb69e4bdf31ef7adce698539b35a1a';

    const getWeather = () => {
        if (!city) {
            alert('Please enter a city');
            return;
        }

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== "200") {
                    setError(data.message);
                    setWeather(null);
                } else {
                    setWeather(data);
                    setError('');
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                setError('Error fetching current weather data. Please try again.');
            });

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== "200") {
                    setError(data.message);
                } else {
                    setHourlyData(data.list.slice(0, 8));
                }
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                setError('Error fetching hourly forecast data. Please try again.');
            });
    };

    return (
        <div id="weather-container">
            <h2>Weather</h2>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter your location" />
            <button onClick={getWeather}>Search</button>
            {error && <p>{error}</p>}
            {weather && (
                <>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="Weather Icon" />
                    <div id="temp-div">
                        <p>{Math.round(weather.main.temp - 273.15)}°C</p>
                    </div>
                    <div id="weather-info">
                        <p>{weather.name}</p>
                        <p>{weather.weather[0].description}</p>
                    </div>
                </>
            )}
            {hourlyData.length > 0 && (
                <div id="hourly-forecast">
                    {hourlyData.map((item, index) => (
                        <div key={index} className="hourly-item">
                            <span>{new Date(item.dt * 1000).getHours()}:00</span>
                            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Hourly Weather Icon" />
                            <span>{Math.round(item.main.temp - 273.15)}°C</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Weather;
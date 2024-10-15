import React, { useState, useEffect } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import clearSkyAnimation from "./animations/clear-sky.json";
import rainAnimation from "./animations/rain.json";
import snowAnimation from "./animations/snow.json";
import cloudAnimation from "./animations/cloud.json";
import brightModeImage from "./animations/bright-mode-image.jpg";
import darkModeImage from "./animations/dark-mode-image.jpg";
import WeatherChart from "./WeatherChart";
import WeatherMap from "./WeatherMap";
import './styles.css'; // Ensure your CSS file includes the card styles

const Weather = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [uvIndex, setUvIndex] = useState(null);

  const API_KEY = "2bdf1b8f06bdcd0f8aa6ee756946ef82";
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}`;
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${API_KEY}`;
  const UV_URL = `https://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}`;

  // Fetch Weather Data for a given city
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const weatherResponse = await axios.get(`${API_URL}&q=${cityName}`);
      setCurrentWeather(weatherResponse.data);

      const forecastResponse = await axios.get(`${FORECAST_URL}&q=${cityName}`);
      setForecast(forecastResponse.data.list);

      const { coord } = weatherResponse.data;
      const uvResponse = await axios.get(`${UV_URL}&lat=${coord.lat}&lon=${coord.lon}`);
      setUvIndex(uvResponse.data.value);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Weather Data based on geolocation
  const fetchWeatherByGeolocation = async (latitude, longitude) => {
    setLoading(true);
    setError("");
    try {
      const weatherResponse = await axios.get(`${API_URL}&lat=${latitude}&lon=${longitude}`);
      setCurrentWeather(weatherResponse.data);

      const forecastResponse = await axios.get(`${FORECAST_URL}&lat=${latitude}&lon=${longitude}`);
      setForecast(forecastResponse.data.list);

      const uvResponse = await axios.get(`${UV_URL}&lat=${latitude}&lon=${longitude}`);
      setUvIndex(uvResponse.data.value);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use geolocation to get the user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByGeolocation(latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location", error);
          setError("Unable to retrieve your location. Please search for a city.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Handle city search
  const handleCityClick = (cityName) => {
    setCity(cityName);
    fetchWeatherData(cityName);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const addToFavorites = () => {
    if (city && !favoriteCities.includes(city)) {
      setFavoriteCities((prevFavorites) => [...prevFavorites, city]);
      setCity("");
    }
  };

  const getWeatherAnimation = (condition) => {
    switch (condition) {
      case 'Clear':
        return clearSkyAnimation;
      case 'Rain':
        return rainAnimation;
      case 'Snow':
        return snowAnimation;
      case 'Clouds':
        return cloudAnimation;
      default:
        return clearSkyAnimation;
    }
  };

  useEffect(() => {
    // Fetch the user's location when the component mounts
    getUserLocation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Background Image */}
      <img
        src={isDarkMode ? darkModeImage : brightModeImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      />

      <h1 className="text-3xl font-bold text-white mb-4">Weather App</h1>
      
      <label className="relative inline-flex items-center cursor-pointer mt-4">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"></div>
      </label>

      {loading && (
        <div className="loader mt-4">
          <span className="loader-text">Loading...</span>
          <span className="load"></span>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {currentWeather && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full justify-items-center">
          {/* Current Weather Card */}
          <div className="h-[38em] w-[30em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex justify-center items-start flex-col gap-[0.75em] backdrop-blur-[12px]">
            <h1 className="text-[2em] font-medium">Current Weather in {currentWeather.name}</h1>
            <div className="weather-animation mb-4">
              <Player
                autoplay
                loop
                src={getWeatherAnimation(currentWeather.weather[0].main)}
                style={{ height: '120px', width: '120px' }}
              />
            </div>
            <p className="text-lg">Temperature: <span className="font-bold">{currentWeather.main.temp} °C</span></p>
            <p className="text-lg">Humidity: <span className="font-bold">{currentWeather.main.humidity} %</span></p>
            <p className="text-lg">Wind Speed: <span className="font-bold">{currentWeather.wind.speed} m/s</span></p>
            <p className="text-lg">Pressure: <span className="font-bold">{currentWeather.main.pressure} hPa</span></p>
            <p className="text-lg">Sunrise: <span className="font-bold">{new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</span></p>
            <p className="text-lg">Sunset: <span className="font-bold">{new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</span></p>
            {uvIndex !== null && <p className="text-lg">UV Index: <span className="font-bold">{uvIndex}</span></p>}
          </div>

          {/* Weather Chart Card */}
          <div className="h-[38em] w-[30em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex justify-center items-start flex-col gap-[0.75em] backdrop-blur-[12px]">
            <h1 className="text-[2em] font-medium">Weather Data Chart</h1>
            <WeatherChart weatherData={currentWeather} />
          </div>

          {/* Weather Map Card */}
          <div className="weather-map h-[30em] w-full border-2 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Weather Map</h2>
            <WeatherMap position={[currentWeather.coord.lat, currentWeather.coord.lon]} weatherData={currentWeather} />
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast mt-6 bg-white bg-opacity-30 backdrop-blur-lg p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(
              forecast.reduce((acc, current) => {
                const date = new Date(current.dt * 1000).toLocaleDateString();
                if (!acc[date]) {
                  acc[date] = current;
                }
                return acc;
              }, {})
            ).slice(0, 5)
            .map((day) => (
              <div key={day.dt} className="forecast-day bg-gray-200 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-60 transition-colors duration-300">
                <p className="font-semibold">Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: <span className="font-bold">{day.main.temp} °C</span></p>
                <p>Description: <span className="font-bold">{day.weather[0].description}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Me Card */}
      <div className="card mt-8 mx-auto mb-4">
        <div className="img">
       {/* Add your image source here */}
          <img src={require('./animations/logo.jpeg')} alt="About Me" className="w-20 h-20 object-cover rounded-md mx-auto" />
       </div>
        <span>About Me</span>
        <p className="info">
        I’m Sai Rama Prasanth K, a multidisciplinary tech enthusiast with a passion for solving real-world problems through data-driven solutions. I specialize in machine learning, web development, and generative AI, delivering meaningful experiences through interactive applications and responsive websites.
        </p>
        <div className="share">
          <a href="https://github.com/Prasanthk4">
            <svg viewBox="0 0 16 16" className="bi bi-github" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <a href="https://x.com/30Prasanth1">
            <svg viewBox="0 0 16 16" className="bi bi-twitter" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
            </svg>
          </a>
          <a href="https://www.instagram.com/prasanthkanakadandi/">
            <svg viewBox="0 0 16 16" className="bi bi-instagram" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
            </svg>
          </a>

        </div>
      </div>
      <div className="mt-4"></div>

      {/* Add CSS for the card */}
      <style>
        {`
          .card {
            width: 17em;
            height: 22.5em;
            background: #171717;
            transition: 1s ease-in-out;
            clip-path: polygon(
              30px 0%,
              100% 0,
              100% calc(100% - 30px),
              calc(100% - 30px) 100%,
              0 100%,
              0% 30px
            );
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            display: flex;
            flex-direction: column;
            margin-top: 2rem; /* Add some margin to separate from other content */
          }

          .card span {
            font-weight: bold;
            color: white;
            text-align: center;
            display: block;
            font-size: 1em;
          }

          .card .info {
            font-weight: 400;
            color: white;
            display: block;
            text-align: center;
            font-size: 0.72em;
            margin: 1em;
          }

          .card .img {
            width: 4.8em;
            height: 4.8em;
            background: white;
            border-radius: 15px;
            margin: auto;
          }

          .card .share {
            margin-top: 1em;
            display: flex;
            justify-content: center;
            gap: 1em;
          }

          .card a {
            color: white;
            transition: 0.4s ease-in-out;
          }

          .card a:hover {
            color: red;
          }

          .card button {
            padding: 0.8em 1.7em;
            display: block;
            margin: auto;
            border-radius: 25px;
            border: none;
            font-weight: bold;
            background: #ffffff;
            color: rgb(0, 0, 0);
            transition: 0.4s ease-in-out;
          }

          .card button:hover {
            background: red;
            color: white;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Weather;

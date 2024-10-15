// src/services/weatherService.js
import axios from 'axios';

const API_KEY = '2bdf1b8f06bdcd0f8aa6ee756946ef82';  // Replace with your actual API key

const getWeatherByCity = (city) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
};

const getForecastByCity = (city) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
};

export default { getWeatherByCity, getForecastByCity };

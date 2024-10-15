import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeatherChart = ({ weatherData }) => {
  // Check if weatherData is defined and has the required structure
  if (!weatherData || !weatherData.main || !weatherData.wind) {
    return <p className="text-red-500">Weather data is not available.</p>;
  }

  // Prepare the chart data
  const chartData = {
    labels: ["Temperature", "Humidity", "Wind Speed"],
    datasets: [
      {
        label: "Current Weather Data",
        data: [
          weatherData.main.temp,
          weatherData.main.humidity,
          weatherData.wind.speed,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Color for Temperature
          "rgba(54, 162, 235, 0.6)", // Color for Humidity
          "rgba(75, 192, 192, 0.6)", // Color for Wind Speed
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Border for Temperature
          "rgba(54, 162, 235, 1)", // Border for Humidity
          "rgba(75, 192, 192, 1)", // Border for Wind Speed
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff', // Change Y-axis tick color to white for better visibility in dark mode
        },
      },
      x: {
        ticks: {
          color: '#ffffff', // Change X-axis tick color to white for better visibility in dark mode
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Change legend text color to white
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}> {/* Adjust height here */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

// PropTypes for type checking
WeatherChart.propTypes = {
  weatherData: PropTypes.shape({
    main: PropTypes.shape({
      temp: PropTypes.number,
      humidity: PropTypes.number,
    }),
    wind: PropTypes.shape({
      speed: PropTypes.number,
    }),
  }),
};

export default WeatherChart;

// WeatherMap.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { BaseLayer, Overlay } = LayersControl;

const WeatherMap = ({ position, weatherData }) => {
  const API_KEY = "2bdf1b8f06bdcd0f8aa6ee756946ef82"; // Replace with your actual OpenWeatherMap API Key
  
  // Initialize the default marker icon
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  // Base URL for weather layers
  const weatherLayerBaseUrl = `https://tile.openweathermap.org/map/`;

  return (
    <MapContainer center={position} zoom={5} style={{ height: "400px", width: "100%" }}>
      {/* Default Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <LayersControl position="topright">
        {/* Base Map Layer */}
        <BaseLayer checked name="Standard Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Weather Layers */}
        <Overlay name="Clouds">
  <TileLayer
    url={`${weatherLayerBaseUrl}clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
    opacity={0.8} // Adjusted opacity for better visibility
  />
</Overlay>
<Overlay name="Precipitation">
  <TileLayer
    url={`${weatherLayerBaseUrl}precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
    opacity={0.8} // Adjusted opacity for better visibility
  />
</Overlay>
<Overlay name="Temperature">
  <TileLayer
    url={`${weatherLayerBaseUrl}temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
    opacity={0.8} // Adjusted opacity for better visibility
  />
</Overlay>
<Overlay name="Wind Speed">
  <TileLayer
    url={`${weatherLayerBaseUrl}wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
    opacity={0.8} // Adjusted opacity for better visibility
  />
</Overlay>

      </LayersControl>

      {/* Marker for Current Location */}
      <Marker position={position}>
        <Popup>
          Current Weather: {weatherData.main.temp} °C
          <br />
          Condition: {weatherData.weather[0].description}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default WeatherMap;

// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Weather from "./Weather";
import Auth from "./Auth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>
  );
};

export default App;

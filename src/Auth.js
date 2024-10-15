import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Track whether in login or signup mode
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulate a login request
      if (email && password) {
        // Replace this with actual authentication logic
        console.log("Logged in with:", email, password);
        navigate("/weather"); // Navigate to the weather page on success
      } else {
        setError("Please enter your email and password.");
      }
    } else {
      // Simulate a signup request
      if (email && password) {
        // Replace this with actual signup logic
        console.log("Signed up with:", email, password);
        navigate("/weather"); // Navigate to the weather page on success
      } else {
        setError("Please enter a valid email and password.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            required
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition ease-in-out duration-150"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        
        <p className="text-gray-900 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;

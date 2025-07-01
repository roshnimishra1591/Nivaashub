import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../apiAdmin"; // Assuming this handles the actual API call
import logo from '/logo.png'; // Make sure the path to your logo is correct
import {
  FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaEye, FaEyeSlash,
  FaExclamationCircle, FaQuestionCircle, FaUser, FaBuilding
} from 'react-icons/fa'; // Importing necessary icons

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const res = await adminLogin({ email, password });
      localStorage.setItem("token", res.data.token);
      // You might also want to store user info if needed
      // localStorage.setItem("adminInfo", JSON.stringify(res.data.admin));

      // Handle "Remember Me" logic (optional: store email/password securely if true, or just token)
      if (rememberMe) {
        // In a real application, you'd store tokens in more secure ways
        // (e.g., HttpOnly cookies) for persistence, not plaintext credentials.
        // For local storage, simply persisting the token is common.
      } else {
        // If not remembered, clear any persistent login data after session ends
        // (already handled by local storage token expiry or manual logout)
      }

      navigate("/admin-otp");
    } catch (err) {
      console.error("Admin login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-blue-100 transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-down">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NivaasHub Logo" className="h-20 w-auto rounded-full p-2 bg-blue-50" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-900">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-900 select-none cursor-pointer">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition">
              <FaQuestionCircle className="inline-block mr-1 text-xs" /> Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt /> Admin Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <p className="text-gray-600 text-sm mb-3">Or login as:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/login"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaUser /> User Login
            </Link>
            <Link
              to="/owner-login"
              className="bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaBuilding /> Owner Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
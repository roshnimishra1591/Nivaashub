import React, { useState } from 'react';
import { login } from '../api'; // Assuming your API service is correctly set up
import { useNavigate, Link } from 'react-router-dom';
import logo from '/logo.png'; // Make sure the path to your logo is correct, assuming it's in the parent folder
import {
  FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaEye, FaEyeSlash,
  FaExclamationCircle, FaUserPlus, FaUserTie, FaBuilding, FaQuestionCircle
} from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Assuming 'login' function in '../api' returns the response directly
      // and places the token at res.data.token if successful.
      const res = await login(email, password); 
      
      if (res.token) { // Check if 'token' property exists directly on the response
        localStorage.setItem('token', res.token);
        // localStorage.setItem('userInfo', JSON.stringify(res.user)); // Store user info if available
        navigate('/'); // redirect to home or dashboard after successful login
      } else {
        // If 'res' is not an object or doesn't have a 'token' but somehow indicates failure
        setError(res.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      // More specific error handling for network issues vs. server errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-blue-100 transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-down">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NivaasHub Logo" className="h-20 w-auto rounded-full p-2 bg-blue-50" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-900">Sign In to NivaasHub</h2>

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
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-12"
              />
              <span
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end text-sm"> {/* Align forgot password to right */}
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition">
              <FaQuestionCircle className="inline-block mr-1 text-xs" /> Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <p className="text-gray-600 text-sm mb-3">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline flex items-center justify-center gap-1 mt-2"
            >
              <FaUserPlus /> Sign Up
            </Link>
          </p>
          <hr className="my-4 border-gray-200" /> {/* Separator */}
          <p className="text-gray-600 text-sm mb-3">Or login as:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/owner-login"
              className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaBuilding /> Owner Login
            </Link>
            <Link
              to="/admin-login"
              className="bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition duration-300 transform hover:scale-105"
            >
              <FaUserTie /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
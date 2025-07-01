import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ownerSignup } from "../apiOwner"; // Assuming this handles the actual API call
import logo from '/logo.png'; // Make sure the path to your logo is correct
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus, FaSpinner,
  FaEye, FaEyeSlash, FaExclamationCircle, FaSignInAlt
} from 'react-icons/fa'; // Importing necessary icons

export default function OwnerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const res = await ownerSignup({ name, email, password, phone });
      localStorage.setItem("token", res.data.token);
      // You might also want to store owner info if needed
      // localStorage.setItem("ownerInfo", JSON.stringify(res.data.owner));
      navigate("/owner-dashboard"); // Redirect to owner dashboard after successful signup
    } catch (err) {
      console.error("Owner signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100 font-sans antialiased">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-purple-100 transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-down">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NivaasHub Logo" className="h-20 w-auto rounded-full p-2 bg-purple-50" />
        </div>
        <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-900">Owner Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="name"
                placeholder="Full Name"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
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
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="sr-only">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="phone"
                placeholder="Phone (optional)"
                className="w-full px-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Signing Up...
              </>
            ) : (
              <>
                <FaUserPlus /> Sign Up as Owner
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <p className="text-gray-600 text-sm mb-3">
            Already have an owner account?{' '}
            <Link
              to="/owner-login"
              className="text-purple-700 hover:text-purple-800 font-semibold hover:underline flex items-center justify-center gap-1 mt-2"
            >
              <FaSignInAlt /> Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
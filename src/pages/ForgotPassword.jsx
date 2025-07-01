import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message || "If this email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">Forgot Password</h2>
        {message && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">{error}</div>}
        <label className="block mb-2 text-gray-700 font-semibold">Email Address</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

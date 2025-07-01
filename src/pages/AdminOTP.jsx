import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from '/logo.png'; // Make sure the path to your logo is correct
import {
  FaKey, FaCheckCircle, FaExclamationCircle, FaSpinner, FaRedo, FaTimesCircle, FaArrowLeft
} from 'react-icons/fa'; // Importing necessary icons

// --- HELPER FUNCTION: Generates a 6-digit random OTP ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- OTP COOLDOWN DURATION (in seconds) ---
const RESEND_COOLDOWN_SECONDS = 60;
// --- MAX ATTEMPTS before redirecting ---
const MAX_ATTEMPTS = 5;

export default function AdminOTP() {
  const [inputOtp, setInputOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentOtp, setCurrentOtp] = useState(""); // The OTP that's currently valid
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false); // For button loading state
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown for resend button
  const navigate = useNavigate();

  // --- Effect to generate initial OTP and handle resend cooldown ---
  useEffect(() => {
    // Generate and save a new OTP on component mount
    const newOtp = generateOTP();
    setCurrentOtp(newOtp);
    localStorage.setItem("admin_otp", newOtp); // Store only as 'admin_otp', not for demo

    // Handle resend cooldown timer
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [resendCooldown]); // Dependency array for resend cooldown

  // --- Resend OTP function ---
  const handleResendOtp = () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // In a real app, this would trigger a backend call to send a new OTP
    // For demo, we just generate locally
    const newOtp = generateOTP();
    setCurrentOtp(newOtp);
    localStorage.setItem("admin_otp", newOtp); // Store only as 'admin_otp'

    setResendCooldown(RESEND_COOLDOWN_SECONDS); // Start cooldown
    setLoading(false);
    setError("A new OTP has been generated. Please check console (or email/SMS in a real app).");
  };

  // --- Handle OTP Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (inputOtp === localStorage.getItem("admin_otp")) { // Validate against stored OTP
      setSuccess(true);
      setError(""); // Clear any previous error
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500); // Give user a moment to see success message
    } else {
      setAttempts(prev => {
        const nextAttempts = prev + 1;
        if (nextAttempts >= MAX_ATTEMPTS) {
          setError(`Too many invalid attempts. Redirecting to login.`);
          setTimeout(() => {
            navigate("/admin-login"); // Redirect to admin login after too many failed attempts
          }, 2000);
        } else {
          setError(`Invalid OTP. You have ${MAX_ATTEMPTS - nextAttempts} attempts remaining.`);
          // For demo, re-generate OTP on each failure to simulate a new OTP being sent
          const newOtp = generateOTP();
          setCurrentOtp(newOtp);
          localStorage.setItem("admin_otp", newOtp);
        }
        return nextAttempts;
      });
      setInputOtp(""); // Clear input on error
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md border border-blue-100 transform transition-all duration-300 animate-fade-in-down">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="NivaasHub Logo" className="h-20 w-auto rounded-full p-2 bg-blue-50" />
        </div>
        <h2 className="text-3xl font-extrabold mb-4 text-center text-blue-900">Admin OTP Verification</h2>
        <p className="text-gray-700 mb-6 text-center leading-relaxed">
          Please enter the 6-digit verification code sent to your registered admin email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="block sm:inline">OTP Verified! Redirecting to dashboard...</span>
            </div>
          )}

          <div>
            <label htmlFor="otp-input" className="sr-only">Enter OTP</label>
            <div className="relative">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="otp-input"
                maxLength={6}
                pattern="[0-9]{6}" // Enforce 6 digits
                inputMode="numeric" // Optimize for numeric input on mobile
                placeholder="------" // Visual placeholder for 6 digits
                className="w-full px-12 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-center text-3xl font-bold tracking-[.7em] uppercase"
                value={inputOtp}
                onChange={e => setInputOtp(e.target.value.replace(/\D/g, ""))} // Only allow digits
                required
                disabled={success || attempts >= MAX_ATTEMPTS} // Disable input on success or max attempts
              />
            </div>
            {attempts > 0 && attempts < MAX_ATTEMPTS && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                Attempts remaining: <span className="font-semibold text-red-500">{MAX_ATTEMPTS - attempts}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success || attempts >= MAX_ATTEMPTS}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <FaKey /> Verify OTP
              </>
            )}
          </button>

          <div className="flex justify-between items-center text-sm pt-2">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || loading || attempts >= MAX_ATTEMPTS}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 ? (
                <span><FaRedo className="inline-block animate-spin-reverse" /> Resend in {resendCooldown}s</span>
              ) : (
                <span><FaRedo /> Resend OTP</span>
              )}
            </button>
            <Link to="/admin-login" className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
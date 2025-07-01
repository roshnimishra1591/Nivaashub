import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaCog, FaLock, FaBell, FaTrash, FaSave, FaSpinner,
  FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaEye, FaEyeSlash
} from "react-icons/fa"; // Importing various icons

export default function OwnerSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    newBookingEmail: true,
    newBookingSms: false,
    updateEmail: true,
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New password and confirm new password do not match.");
      setPasswordSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/owner/change-password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (err) {
      console.error("Change password error:", err.response?.data || err.message);
      setPasswordError(err.response?.data?.message || "Failed to change password.");
      setTimeout(() => setPasswordError(""), 5000);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setNotificationSaving(true);
    setNotificationError("");
    setNotificationSuccess("");

    try {
      const token = localStorage.getItem("token");
      // This is a placeholder. Your backend would need an endpoint to handle notification settings.
      // For example: PUT /api/owner/settings/notifications
      await axios.put(`${API_URL}/owner/settings/notifications`, notificationSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificationSuccess("Notification settings saved successfully!");
      setTimeout(() => setNotificationSuccess(""), 3000);
    } catch (err) {
      console.error("Save notifications error:", err.response?.data || err.message);
      setNotificationError(err.response?.data?.message || "Failed to save notification settings.");
      setTimeout(() => setNotificationError(""), 5000);
    } finally {
      setNotificationSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased">
      {/* Dashboard-like Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NivaasHub Logo" className="h-10 w-10 bg-white rounded-full p-1" />
          <span className="text-2xl font-bold text-blue-900">NivaasHub Owner</span>
        </div>
        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-semibold"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-3xl border border-blue-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
              <FaCog className="text-blue-600" /> Settings
            </h2>
          </div>

          {/* Change Password Section */}
          <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
              <FaLock className="text-blue-500" /> Change Password
            </h3>
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaExclamationCircle className="text-red-500 text-xl" />
                <span className="block sm:inline">{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span className="block sm:inline">{passwordSuccess}</span>
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-semibold mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-10"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-10"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 pr-10"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  >
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {passwordSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <FaSave /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Notification Settings Section */}
          <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
              <FaBell className="text-blue-500" /> Notification Preferences
            </h3>
            {notificationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaExclamationCircle className="text-red-500 text-xl" />
                <span className="block sm:inline">{notificationError}</span>
              </div>
            )}
            {notificationSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span className="block sm:inline">{notificationSuccess}</span>
              </div>
            )}
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <label htmlFor="newBookingEmail" className="text-gray-700 font-medium cursor-pointer">
                  Email for New Bookings
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="newBookingEmail"
                    name="newBookingEmail"
                    checked={notificationSettings.newBookingEmail}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <label htmlFor="newBookingSms" className="text-gray-700 font-medium cursor-pointer">
                  SMS for New Bookings (Charges apply)
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="newBookingSms"
                    name="newBookingSms"
                    checked={notificationSettings.newBookingSms}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2">
                <label htmlFor="updateEmail" className="text-gray-700 font-medium cursor-pointer">
                  Email for Profile Updates
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="updateEmail"
                    name="updateEmail"
                    checked={notificationSettings.updateEmail}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <button
                type="submit"
                disabled={notificationSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 mt-6"
              >
                {notificationSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Notifications
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Delete Account Section (Optional but common) */}
          <div className="p-6 bg-red-50 rounded-lg shadow-inner border border-red-200">
            <h3 className="text-2xl font-bold text-red-800 mb-5 border-b border-red-300 pb-3 flex items-center gap-2">
              <FaTrash className="text-red-500" /> Danger Zone
            </h3>
            <p className="text-red-700 mb-4">
              Permanently delete your NivaasHub account and all associated data, including your properties and bookings. This action cannot be undone.
            </p>
            <button
              onClick={() => alert("Account deletion not yet implemented. Please contact support.")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
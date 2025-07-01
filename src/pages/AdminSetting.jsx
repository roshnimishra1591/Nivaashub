import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaCog, FaLock, FaBell, FaTrash, FaSave, FaSpinner,
  FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaEye, FaEyeSlash,
  FaGlobe, FaTools // New icons for general settings
} from "react-icons/fa"; // Importing various icons

export default function AdminSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [generalSettings, setGeneralSettings] = useState({
    maintenanceMode: false,
    defaultCurrency: "NPR",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [generalSaving, setGeneralSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [generalSuccess, setGeneralSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // --- Handlers for Password Change ---
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
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

    if (passwordForm.newPassword.length < 8) { // Basic password strength
        setPasswordError("New password must be at least 8 characters long.");
        setPasswordSaving(false);
        return;
    }

    try {
      const token = localStorage.getItem("token");
      // Assuming your backend has an endpoint like /api/admin/change-password
      await axios.put(`${API_URL}/admin/change-password`, passwordForm, {
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

  // --- Handlers for General Settings ---
  const handleGeneralSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setGeneralSaving(true);
    setGeneralError("");
    setGeneralSuccess("");

    try {
      const token = localStorage.getItem("token");
      // This is a placeholder. Your backend would need an endpoint to handle general settings.
      // For example: PUT /api/admin/settings/general
      await axios.put(`${API_URL}/admin/settings/general`, generalSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneralSuccess("General settings saved successfully!");
      setTimeout(() => setGeneralSuccess(""), 3000);
    } catch (err) {
      console.error("Save general settings error:", err.response?.data || err.message);
      setGeneralError(err.response?.data?.message || "Failed to save general settings.");
      setTimeout(() => setGeneralError(""), 5000);
    } finally {
      setGeneralSaving(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased">
      {/* Admin Dashboard Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NivaasHub Logo" className="h-10 w-10 bg-white rounded-full p-1" />
          <span className="text-2xl font-bold text-blue-900">NivaasHub Admin</span>
        </div>
        <button
          onClick={() => navigate('/admin-dashboard')}
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
              <FaCog className="text-blue-600" /> Admin Settings
            </h2>
          </div>

          {/* Change Password Section */}
          <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
              <FaLock className="text-blue-500" /> Change Admin Password
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

          {/* General Settings Section */}
          <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
              <FaGlobe className="text-blue-500" /> General Platform Settings
            </h3>
            {generalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaExclamationCircle className="text-red-500 text-xl" />
                <span className="block sm:inline">{generalError}</span>
              </div>
            )}
            {generalSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3 animate-fade-in">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span className="block sm:inline">{generalSuccess}</span>
              </div>
            )}
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <label htmlFor="maintenanceMode" className="text-gray-700 font-medium cursor-pointer">
                  Enable Maintenance Mode <FaTools className="inline-block ml-1 text-gray-500" />
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onChange={handleGeneralSettingChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label htmlFor="defaultCurrency" className="block text-gray-700 text-sm font-semibold mb-2">Default Currency</label>
                <select
                  id="defaultCurrency"
                  name="defaultCurrency"
                  value={generalSettings.defaultCurrency}
                  onChange={handleGeneralSettingChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                >
                  <option value="NPR">NPR - Nepalese Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={generalSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 mt-6"
              >
                {generalSaving ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save General Settings
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Danger Zone: Delete Admin Account */}
          <div className="p-6 bg-red-50 rounded-lg shadow-inner border border-red-200">
            <h3 className="text-2xl font-bold text-red-800 mb-5 border-b border-red-300 pb-3 flex items-center gap-2">
              <FaTrash className="text-red-500" /> Danger Zone: Admin Account
            </h3>
            <p className="text-red-700 mb-4">
              This action will permanently delete your Admin account and all associated administrative records. This action cannot be undone and should only be performed with extreme caution.
            </p>
            <button
              onClick={() => alert("Admin account deletion is a critical operation and typically requires multi-factor authentication and strict internal procedures. Please contact your system administrator to proceed.")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled // Keep this disabled in a demo to prevent accidental clicks
            >
              <FaTrash /> Delete Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
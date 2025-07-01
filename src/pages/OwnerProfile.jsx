import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaUserCircle, FaEdit, FaSave, FaTimes, FaSpinner, FaExclamationCircle,
  FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaArrowLeft, FaCamera, FaTrashAlt
} from "react-icons/fa"; // Importing new icons for image upload

export default function OwnerProfile() {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // For success messages
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [selectedFile, setSelectedFile] = useState(null); // State for the new file selected for upload
  const [profileImagePreview, setProfileImagePreview] = useState(""); // For displaying the current/selected image
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null); // Ref to programmatically click the hidden file input

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // --- Effects ---
  useEffect(() => {
    fetchProfile();
  }, []);

  // Effect to update profile image preview whenever selectedFile or owner changes
  useEffect(() => {
    if (selectedFile) {
      // If a new file is selected, create a URL for its preview
      setProfileImagePreview(URL.createObjectURL(selectedFile));
      setError(""); // Clear any previous file-related errors
    } else if (owner && owner.profileImage) {
      // If no new file, but owner has an existing image, show that
      setProfileImagePreview(owner.profileImage);
    } else {
      // No file selected, no existing image, revert to empty/default avatar
      setProfileImagePreview("");
    }
  }, [selectedFile, owner]);

  // --- API Calls ---
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/owner-login");
        return;
      }
      const res = await axios.get(`${API_URL}/owner/me`, { headers: { Authorization: `Bearer ${token}` } });
      setOwner(res.data.owner);
      setForm({
        name: res.data.owner.name || "",
        email: res.data.owner.email || "",
        phone: res.data.owner.phone || ""
      });
      // Set initial preview to the owner's existing profile image
      setProfileImagePreview(res.data.owner.profileImage || "");
      setSelectedFile(null); // Ensure no old file selection persists
    } catch (err) {
      console.error("Failed to load profile:", err.response?.data || err.message);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, and GIF images are allowed.");
        setSelectedFile(null); // Clear invalid file
        return;
      }
      if (file.size > maxSize) {
        setError("Image size cannot exceed 5MB.");
        setSelectedFile(null); // Clear invalid file
        return;
      }

      setSelectedFile(file);
      setError(""); // Clear any previous errors if file is valid
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null); // Clear any newly selected file
    setProfileImagePreview(""); // Clear the preview
    // This flag tells the backend to remove the existing image
    setForm(prev => ({ ...prev, profileImage: null }));
    setError(""); // Clear any errors
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    if (selectedFile) {
      // If a new file is selected, append it to FormData
      formData.append("profileImage", selectedFile);
    } else if (form.profileImage === null && owner?.profileImage) {
      // If user explicitly clicked "Remove Photo" and there was an old image,
      // send a flag to the backend to delete it.
      formData.append("removeProfileImage", "true");
    }
    // If no new file and no explicit removal, the backend should just keep the existing image

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_URL}/owner/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Axios automatically sets Content-Type to multipart/form-data when FormData is used,
          // but explicitly setting it can be good practice.
          'Content-Type': 'multipart/form-data',
        }
      });
      setOwner(res.data.owner); // Update owner state with new data (including new image URL)
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setSelectedFile(null); // Clear selected file after successful upload
      // Ensure the displayed image reflects the new state from backend
      setProfileImagePreview(res.data.owner.profileImage || "");
      // Update form's internal profileImage state to reflect backend's source of truth
      setForm(prev => ({ ...prev, profileImage: res.data.owner.profileImage || null }));

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form and image preview to original owner data
    setForm({
      name: owner.name || "",
      email: owner.email || "",
      phone: owner.phone || ""
    });
    setProfileImagePreview(owner?.profileImage || "");
    setSelectedFile(null); // Clear any selected file
    setEditMode(false);
    setError("");
    setSuccess("");
  };

  // --- Render ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <p className="ml-4 text-xl text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error && !editMode) { // Show full error page only if not in edit mode
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600 p-4">
        <FaExclamationCircle className="text-6xl mb-4" />
        <p className="text-xl font-semibold mb-2">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const defaultAvatar = "https://via.placeholder.com/150/cccccc/ffffff?text=Avatar"; // Placeholder for default avatar

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
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-2xl border border-blue-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
              <FaUserCircle className="text-blue-600" /> My Profile
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Messages: Error and Success */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {owner && !editMode && (
            <div className="space-y-6 text-gray-800 flex flex-col items-center">
              {/* Profile Image in View Mode */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md mb-6">
                <img
                  src={owner.profileImage || defaultAvatar}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full space-y-4">
                <div className="flex items-center text-lg md:text-xl">
                  <FaUser className="text-blue-500 mr-3 text-2xl" />
                  <span className="font-semibold w-24">Name:</span>
                  <span className="flex-1">{owner.name || "N/A"}</span>
                </div>
                <div className="flex items-center text-lg md:text-xl">
                  <FaEnvelope className="text-blue-500 mr-3 text-2xl" />
                  <span className="font-semibold w-24">Email:</span>
                  <span className="flex-1">{owner.email || "N/A"}</span>
                </div>
                <div className="flex items-center text-lg md:text-xl">
                  <FaPhone className="text-blue-500 mr-3 text-2xl" />
                  <span className="font-semibold w-24">Phone:</span>
                  <span className="flex-1">{owner.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {owner && editMode && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Image Upload Section in Edit Mode */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md mb-4 relative group">
                  <img
                    src={profileImagePreview || defaultAvatar}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for Change/Remove buttons on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
                      title="Change Profile Photo"
                    >
                      <FaCamera size={20} />
                    </button>
                    {(profileImagePreview || owner?.profileImage) && ( // Show remove only if there's an image
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="ml-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                        title="Remove Profile Photo"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    )}
                  </div>
                </div>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" // Hide the default file input
                  accept="image/jpeg, image/png, image/gif" // Specify accepted file types
                />
                {/* Visible "Change Photo" button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-200"
                >
                  <FaCamera /> Choose New Photo
                </button>
                {/* Visible "Remove Photo" button (if an image is present) */}
                {(profileImagePreview || owner?.profileImage) && (selectedFile || owner?.profileImage) && (
                     <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                        <FaTrashAlt size={14} /> Remove Current Photo
                    </button>
                )}
              </div>

              {/* Existing Profile Fields */}
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Phone</label>
                <input
                  type="tel" // Use type="tel" for phone numbers
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="e.g., 98XXXXXXXX" // Add a placeholder
                />
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex-1 min-w-[120px] bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-gray-500 text-xs mt-12">
            &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
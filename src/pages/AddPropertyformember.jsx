import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileUpload, FaTimes, FaPlusCircle, FaMapMarkerAlt, FaDollarSign, FaHome, FaBed, FaSpinner, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';

const AddPropertyformember = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const availableAmenities = [
    "Wi-Fi", "Parking", "Furnished", "Air Conditioning", "Heating",
    "Balcony", "Laundry Room", "Gym Access", "24/7 Security", "Pet Friendly"
  ];

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.filter(file => !images.some(img => img.name === file.name && img.size === file.size));
    if (newFiles.length > 0) {
      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.filter(file => file.type.startsWith('image/') && !images.some(img => img.name === file.name && img.size === file.size));
    if (newFiles.length > 0) {
      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setError("");
    } else if (droppedFiles.length > 0 && !newFiles.length) {
      setError("Only image files are allowed or files are duplicates.");
    }
  };
  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };
  const handleAmenityChange = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(item => item !== amenity)
        : [...prev, amenity]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (images.length === 0) {
      setError("Please upload at least one image for the property.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);
      formData.append("area", area);
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("membersOnly", true); // Always true for this page
      images.forEach((image) => {
        formData.append("images", image);
      });
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await axios.post(`${API_URL}/owner/property`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Property added for members only!");
      setName(""); setLocation(""); setPrice(""); setDescription(""); setType("Apartment"); setBedrooms(1); setBathrooms(1); setArea(""); setAmenities([]); setImages([]); setImagePreviews([]);
      setTimeout(() => navigate("/owner/my-properties"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-900">NivaasHub Owner</span>
        </div>
        <button
          onClick={() => navigate('/owner-dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-semibold"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </header>
      <div className="flex justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-4xl border border-blue-100 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center">
            <FaPlusCircle className="inline-block mr-3 text-blue-600" /> List a New Members-Only Property
          </h2>
          <p className="text-center text-gray-700 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            This property will only be visible to users with an active membership.
          </p>
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Details Section */}
            <div>
              <h3 className="text-2xl font-bold text-blue-800 mb-5 border-b pb-3 flex items-center gap-2">
                <FaHome className="text-blue-600" /> Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Property Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="E.g., Cozy Studio Apartment"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      placeholder="E.g., Baneshwor, Kathmandu"
                      className="w-full pl-10 pr-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="price" className="block text-gray-700 text-sm font-semibold mb-2">Rental Price (NPR/month)</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      id="price"
                      placeholder="e.g., 15000"
                      className="w-full pl-10 pr-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="type" className="block text-gray-700 text-sm font-semibold mb-2">Property Type</label>
                  <select
                    id="type"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Room">Single Room</option>
                    <option value="Commercial">Commercial Space</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-semibold mb-2">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    placeholder="e.g., 2"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-semibold mb-2">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    placeholder="e.g., 1"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="area" className="block text-gray-700 text-sm font-semibold mb-2">Area (Sq. Ft.)</label>
                  <input
                    type="number"
                    id="area"
                    placeholder="e.g., 1200"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                  <textarea
                    id="description"
                    placeholder="Provide a detailed description of your property, its features, and any unique selling points."
                    rows="6"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Amenities Section */}
            <div>
              <h3 className="text-2xl font-bold text-blue-800 mb-5 border-b pb-3 flex items-center gap-2">
                <FaBed className="text-blue-600" /> Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="ml-2 text-sm md:text-base">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Images Section */}
            <div>
              <h3 className="text-2xl font-bold text-blue-800 mb-5 border-b pb-3 flex items-center gap-2">
                <FaFileUpload className="text-blue-600" /> Property Images
              </h3>
              <p className="text-gray-600 mb-4 text-sm">Upload clear photos of your property. Max 10 images. First image will be the primary one.</p>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 mb-6"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <FaFileUpload className="mx-auto text-blue-400 text-4xl mb-3" />
                <p className="text-gray-700 font-medium">Drag & Drop your images here, or <span className="text-blue-600 underline">click to browse</span></p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG up to 5MB each</p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md group">
                      <img
                        src={img.url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:scale-110"
                        title="Remove image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Adding Property...
                </>
              ) : (
                <>
                  <FaPlusCircle /> Add Members-Only Property
                </>
              )}
            </button>
          </form>
          <div className="text-center text-gray-500 text-xs mt-12">
            &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPropertyformember

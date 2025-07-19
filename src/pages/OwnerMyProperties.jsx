import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaPlusCircle, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath,
  FaSquare, FaEdit, FaTrash, FaEye, FaSpinner, FaExclamationCircle,
  FaHome, FaArrowLeft, FaImages, FaBuilding
} from "react-icons/fa"; // Importing various icons

export default function OwnerMyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null); // State to track which property is being deleted
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/owner-login");
        return;
      }
      const res = await axios.get(`${API_URL}/owner/properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data.properties);
    } catch (err) {
      console.error("Failed to fetch properties:", err.response?.data || err.message);
      setError("Failed to load your properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setDeletingId(propertyId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/owner/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(prevProperties => prevProperties.filter(prop => prop._id !== propertyId));
      alert("Property deleted successfully!");
    } catch (err) {
      console.error("Failed to delete property:", err.response?.data || err.message);
      setError("Failed to delete property. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/owner/edit-property/${propertyId}`); // Assuming an edit page route
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <p className="ml-4 text-xl text-gray-700">Loading your properties...</p>
      </div>
    );
  }

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
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-6xl border border-blue-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
              <FaBuilding className="text-blue-600" /> My Properties
            </h2>
            <Link
              to="/owner/add-property"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <FaPlusCircle />
              <span className="hidden sm:inline">Add New Property</span>
              <span className="inline sm:hidden">Add New</span>
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <FaHome className="text-blue-400 text-6xl mx-auto mb-6" />
              <p className="text-xl text-gray-700 font-semibold mb-4">You haven't listed any properties yet.</p>
              <p className="text-gray-600 mb-6">Start by adding your first rental space and connect with potential tenants!</p>
              <Link
                to="/owner/add-property"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 flex items-center justify-center mx-auto w-max gap-2 transform hover:scale-105"
              >
                <FaPlusCircle /> List Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <div key={prop._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${properties.indexOf(prop) * 0.1}s` }}>
                  {/* Property Image (Placeholder or first image from array) */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {prop.images && prop.images.length > 0 ? (
                      <img
                        src={
                          prop.images[0].url
                            ? prop.images[0].url
                            : `${API_URL}/uploads/${typeof prop.images[0] === 'string' ? prop.images[0] : ''}`
                        }
                        alt={prop.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <FaImages size={48} />
                        <span className="ml-2">No Image</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{prop.type}</span>
                    {prop.membersOnly && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Members Only</span>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">{prop.name}</h3>
                    <p className="text-gray-600 flex items-center mb-1">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> {prop.location}
                    </p>
                    <p className="text-green-700 font-extrabold text-2xl mb-3 flex items-center">
                      <FaDollarSign className="mr-2 text-green-600" />{prop.price} <span className="text-lg font-medium text-gray-500 ml-1">NPR/month</span>
                    </p>
                    <div className="flex items-center text-gray-700 text-sm mb-4">
                      {prop.bedrooms && (
                        <span className="flex items-center mr-4"><FaBed className="mr-1 text-gray-500" /> {prop.bedrooms} Bed</span>
                      )}
                      {prop.bathrooms && (
                        <span className="flex items-center mr-4"><FaBath className="mr-1 text-gray-500" /> {prop.bathrooms} Bath</span>
                      )}
                      {prop.area && (
                        <span className="flex items-center"><FaSquare className="mr-1 text-gray-500" /> {prop.area} Sq.Ft.</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">{prop.description || prop.desc}</p> {/* Use description or old desc */}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => navigate(`/property/${prop._id}`)} // Link to public view of property
                        className="flex-1 min-w-[100px] bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleEditProperty(prop._id)}
                        className="flex-1 min-w-[100px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        disabled={deletingId === prop._id}
                        className="flex-1 min-w-[100px] bg-red-100 text-red-700 hover:bg-red-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === prop._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
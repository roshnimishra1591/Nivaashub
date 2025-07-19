import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaBuilding, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath,
  FaSquare, FaEdit, FaTrash, FaEye, FaSpinner, FaExclamationCircle,
  FaPlusCircle, FaArrowLeft, FaImages, FaCheckCircle, FaTimesCircle,
  FaStar, FaFilter, FaSearch, FaToggleOn, FaToggleOff, FaUser
} from "react-icons/fa"; // Importing various icons

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // To track loading for individual property actions
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchProperties();
  }, [filterStatus, searchQuery]); // Refetch when filter or search query changes

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to admin login if no token
        return;
      }
      // Add filter and search query to API request
      const res = await axios.get(`${API_URL}/admin/properties`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: filterStatus === 'all' ? undefined : filterStatus, // Only send status if not 'all'
          search: searchQuery || undefined, // Only send search if not empty
        }
      });
      setProperties(res.data.properties);
    } catch (err) {
      console.error("Failed to fetch properties:", err.response?.data || err.message);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (propertyId, actionType, value = null) => {
    if (actionType === 'delete') {
      if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
        return;
      }
    } else if (actionType === 'approve' || actionType === 'reject') {
        if (!window.confirm(`Are you sure you want to ${actionType} this property?`)) {
            return;
        }
    }

    setActionLoadingId(propertyId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let endpoint = '';
      let method = '';
      let data = {};

      switch (actionType) {
        case 'delete':
          endpoint = `${API_URL}/admin/properties/${propertyId}`;
          method = 'delete';
          break;
        case 'approve':
          endpoint = `${API_URL}/admin/properties/${propertyId}/status`;
          method = 'put';
          data = { status: 'approved' };
          break;
        case 'reject':
          endpoint = `${API_URL}/admin/properties/${propertyId}/status`;
          method = 'put';
          data = { status: 'rejected' };
          break;
        case 'toggleFeatured':
          endpoint = `${API_URL}/admin/properties/${propertyId}/featured`;
          method = 'put';
          data = { isFeatured: value };
          break;
        default:
          throw new Error("Invalid action type");
      }

      await axios({
        method: method,
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
        data: data
      });

      // Optimistically update UI or refetch
      if (actionType === 'delete') {
        setProperties(prevProperties => prevProperties.filter(prop => prop._id !== propertyId));
        alert("Property deleted successfully!");
      } else {
        // For status/featured changes, refetch to get updated data and ensure consistency
        fetchProperties();
        alert(`Property ${actionType}d successfully!`);
      }

    } catch (err) {
      console.error(`Failed to ${actionType} property:`, err.response?.data || err.message);
      setError(`Failed to ${actionType} property. Please try again.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaCheckCircle /> Approved</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
      case "pending":
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaSpinner className="animate-spin" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
        <p className="text-xl text-gray-700 font-semibold">Loading all properties...</p>
      </div>
    );
  }

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
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-7xl border border-blue-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
              <FaBuilding className="text-blue-600" /> All Properties
            </h2>
            {/* Link to the owner's add property page, or create an admin specific one */}
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

          {/* Filter and Search Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner">
            <div className="flex-grow relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, owner..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="filterStatus" className="sr-only">Filter by Status</label>
              <select
                id="filterStatus"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <FaBuilding className="text-blue-400 text-6xl mx-auto mb-6" />
              <p className="text-xl text-gray-700 font-semibold mb-4">No properties found matching your criteria.</p>
              <p className="text-gray-600 mb-6">Adjust your filters or add new properties to see them here.</p>
              <Link
                to="/owner/add-property"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 flex items-center justify-center mx-auto w-max gap-2 transform hover:scale-105"
              >
                <FaPlusCircle /> List a New Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <div key={prop._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${properties.indexOf(prop) * 0.1}s` }}>
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {prop.images && prop.images.length > 0 ? (
                      <img
                        src={
                          prop.images[0].url
                            ? prop.images[0].url
                            : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/uploads/${typeof prop.images[0] === 'string' ? prop.images[0] : ''}`
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
                    <div className="absolute bottom-2 left-2">
                        {getStatusBadge(prop.status)}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">{prop.name}</h3>
                    <p className="text-gray-600 flex items-center mb-1 text-sm">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" /> {prop.location}
                    </p>
                    <p className="text-gray-700 text-sm mb-1 flex items-center">
                        <FaUser className="mr-2 text-gray-500" /> Owner: <span className="font-semibold ml-1">{prop.ownerName || 'N/A'}</span> {/* Assuming ownerName is available */}
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
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">{prop.description || prop.desc}</p>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-3 justify-center mt-4">
                      {prop.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handlePropertyAction(prop._id, 'approve')}
                            disabled={actionLoadingId === prop._id}
                            className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === prop._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Approve
                          </button>
                          <button
                            onClick={() => handlePropertyAction(prop._id, 'reject')}
                            disabled={actionLoadingId === prop._id}
                            className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === prop._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />} Reject
                          </button>
                        </>
                      )}
                      {prop.status !== 'pending' && ( // Show these if not pending
                        <>
                          <button
                            onClick={() => handlePropertyAction(prop._id, 'toggleFeatured', !prop.isFeatured)}
                            disabled={actionLoadingId === prop._id}
                            className={`flex-1 min-w-[100px] ${prop.isFeatured ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300 hover:bg-gray-400'} text-white font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {actionLoadingId === prop._id ? <FaSpinner className="animate-spin" /> : (prop.isFeatured ? <FaToggleOn /> : <FaToggleOff />)} {prop.isFeatured ? 'Unfeature' : 'Feature'}
                          </button>
                          <Link
                            to={`/property/${prop._id}`} // Link to public view of property
                            className="flex-1 min-w-[100px] bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-center"
                          >
                            <FaEye /> View
                          </Link>
                          <Link
                            to={`/admin/edit-property/${prop._id}`} // Admin specific edit page
                            className="flex-1 min-w-[100px] bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-center"
                          >
                            <FaEdit /> Edit
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => handlePropertyAction(prop._id, 'delete')}
                        disabled={actionLoadingId === prop._id}
                        className="flex-1 min-w-[100px] bg-red-100 text-red-700 hover:bg-red-200 font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoadingId === prop._id ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
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
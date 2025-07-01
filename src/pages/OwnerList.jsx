import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaUserTie, FaSpinner, FaExclamationCircle, FaArrowLeft,
  FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaToggleOn,
  FaToggleOff, FaTrash, FaEye, FaCalendarAlt, FaEnvelope, FaPhone, FaUser
} from "react-icons/fa"; // Importing various icons

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // To track loading for individual owner actions
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'inactive'
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchOwners();
  }, [filterStatus, searchQuery]); // Refetch when filter or search query changes

  const fetchOwners = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to admin login if no token
        return;
      }
      // Add filter and search query to API request
      const res = await axios.get(`${API_URL}/admin/owners`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: filterStatus === 'all' ? undefined : filterStatus, // Only send status if not 'all'
          search: searchQuery || undefined, // Only send search if not empty
        }
      });
      setOwners(res.data.owners);
    } catch (err) {
      console.error("Failed to fetch owners:", err.response?.data || err.message);
      setError("Failed to load owners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerAction = async (ownerId, actionType, value = null) => {
    if (actionType === 'delete') {
      if (!window.confirm("Are you sure you want to delete this owner and all their associated data (properties, bookings)? This action cannot be undone.")) {
        return;
      }
    } else if (actionType === 'toggleStatus') {
        if (!window.confirm(`Are you sure you want to change this owner's status to ${value ? 'Active' : 'Inactive'}?`)) {
            return;
        }
    }

    setActionLoadingId(ownerId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      let endpoint = '';
      let method = '';
      let data = {};

      switch (actionType) {
        case 'delete':
          endpoint = `${API_URL}/admin/owners/${ownerId}`;
          method = 'delete';
          break;
        case 'toggleStatus':
          endpoint = `${API_URL}/admin/owners/${ownerId}/status`;
          method = 'put';
          data = { isActive: value };
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
        setOwners(prevOwners => prevOwners.filter(owner => owner._id !== ownerId));
        alert("Owner deleted successfully!");
      } else {
        // For status changes, refetch to get updated data and ensure consistency
        fetchOwners();
        alert(`Owner status updated successfully!`);
      }

    } catch (err) {
      console.error(`Failed to ${actionType} owner:`, err.response?.data || err.message);
      setError(`Failed to ${actionType} owner. Please try again.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <FaCheckCircle /> Active
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <FaTimesCircle /> Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
        <p className="text-xl text-gray-700 font-semibold">Loading all owners...</p>
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
              <FaUserTie className="text-blue-600" /> All Owners
            </h2>
            {/* Optionally add a button to invite new owners or add manually */}
            {/* <button
              onClick={() => alert("Invite New Owner functionality")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <FaPlusCircle />
              <span className="hidden sm:inline">Invite Owner</span>
              <span className="inline sm:hidden">Invite</span>
            </button> */}
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
                placeholder="Search by name, email, phone..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {owners.length === 0 ? (
            <div className="text-center py-16">
              <FaUserTie className="text-blue-400 text-6xl mx-auto mb-6" />
              <p className="text-xl text-gray-700 font-semibold mb-4">No owners found matching your criteria.</p>
              <p className="text-gray-600 mb-6">Adjust your filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {owners.map((owner) => (
                    <tr key={owner._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={owner.profileImage || `https://via.placeholder.com/40/F3F4F6/9CA3AF?text=${owner.name ? owner.name.charAt(0) : 'O'}`} alt={owner.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{owner.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{owner.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1"><FaPhone className="text-gray-400 text-xs" /> {owner.phone || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><FaEnvelope className="text-gray-400 text-xs" /> {owner.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          {owner.createdAt ? new Date(owner.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(owner.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-wrap justify-center gap-2">
                          <Link to={`/admin/owner-details/${owner._id}`} className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1">
                            <FaEye /> View
                          </Link>
                          <button
                            onClick={() => handleOwnerAction(owner._id, 'toggleStatus', !owner.isActive)}
                            disabled={actionLoadingId === owner._id}
                            className={`px-2 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${owner.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          >
                            {actionLoadingId === owner._id ? <FaSpinner className="animate-spin text-sm" /> : (owner.isActive ? <FaToggleOff /> : <FaToggleOn />)} {owner.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleOwnerAction(owner._id, 'delete')}
                            disabled={actionLoadingId === owner._id}
                            className="px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === owner._id ? <FaSpinner className="animate-spin text-sm" /> : <FaTrash />} Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
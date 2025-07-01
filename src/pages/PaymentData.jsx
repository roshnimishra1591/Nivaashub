import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaMoneyBillAlt, FaSpinner, FaExclamationCircle, FaArrowLeft,
  FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaClock,
  FaEye, FaCalendarAlt, FaUser, FaBuilding, FaDollarSign
} from "react-icons/fa"; // Importing various icons

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // To track loading for individual payment actions
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'completed', 'pending', 'failed'
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchPayments();
  }, [filterStatus, searchQuery]); // Refetch when filter or search query changes

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to admin login if no token
        return;
      }
      // Add filter and search query to API request
      const res = await axios.get(`${API_URL}/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: filterStatus === 'all' ? undefined : filterStatus, // Only send status if not 'all'
          search: searchQuery || undefined, // Only send search if not empty
        }
      });
      setPayments(res.data.payments);
    } catch (err) {
      console.error("Failed to fetch payments:", err.response?.data || err.message);
      setError("Failed to load payment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaCheckCircle /> Completed</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaClock className="animate-pulse" /> Pending</span>;
      case "failed":
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaTimesCircle /> Failed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
        <p className="text-xl text-gray-700 font-semibold">Loading payment transactions...</p>
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
              <FaMoneyBillAlt className="text-blue-600" /> All Payments
            </h2>
            {/* You could add a button here for manual payment entry or export */}
            {/* <button
              onClick={() => alert("Manual Payment Entry / Export functionality")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <FaPlusCircle />
              <span className="hidden sm:inline">Add Payment</span>
              <span className="inline sm:hidden">Add</span>
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
                placeholder="Search by payer, property, transaction ID..."
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-16">
              <FaMoneyBillAlt className="text-blue-400 text-6xl mx-auto mb-6" />
              <p className="text-xl text-gray-700 font-semibold mb-4">No payment transactions found matching your criteria.</p>
              <p className="text-gray-600 mb-6">Adjust your filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.transactionId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-green-700 font-bold flex items-center">
                        <FaDollarSign className="mr-1 text-green-600" />{payment.amount || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <FaUser className="text-gray-400 text-xs" /> {payment.payerName || 'N/A'}
                          </div>
                          {payment.membershipPlan && (
                            <div className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-0.5 mt-1 w-max">
                              Membership: {payment.membershipPlan}
                            </div>
                          )}
                          {payment.paymentMethod && (
                            <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-0.5 mt-1 w-max">
                              Paid via: {payment.paymentMethod}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <FaBuilding className="text-gray-400 text-xs" /> {payment.propertyName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Link to={`/admin/payment-details/${payment._id}`} className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 w-max mx-auto">
                          <FaEye /> View Details
                        </Link>
                        {/* Add more actions like refund/reversal if your system supports it and is secure */}
                        {/* <button
                          onClick={() => handlePaymentAction(payment._id, 'refund')}
                          disabled={actionLoadingId === payment._id || payment.status !== 'completed'}
                          className="px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoadingId === payment._id ? <FaSpinner className="animate-spin text-sm" /> : <FaUndo />} Refund
                        </button> */}
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
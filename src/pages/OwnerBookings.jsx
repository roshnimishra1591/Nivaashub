import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaCalendarCheck, FaSpinner, FaExclamationCircle, FaArrowLeft,
  FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaBuilding, FaPhone, FaEnvelope, FaPlusCircle
} from "react-icons/fa"; // Importing various icons for bookings

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // To track loading for individual booking actions
  const navigate = useNavigate();

  // Ensure your API URL is correctly configured in your .env file
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/owner-login");
        return;
      }
      const res = await axios.get(`${API_URL}/owner/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings);
    } catch (err) {
      let backendMsg = err?.response?.data?.message || err.message;
      setError(backendMsg || "Failed to load your bookings. Please try again.");
      console.error("Failed to fetch bookings:", backendMsg, err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`)) {
      return;
    }

    setActionLoadingId(bookingId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/owner/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the status of the booking in the local state
      setBookings(prevBookings =>
        prevBookings.map(b => (b._id === bookingId ? { ...b, status: status } : b))
      );
      alert(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} booking:`, err.response?.data || err.message);
      setError(`Failed to ${status.toLowerCase()} booking. Please try again.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaCheckCircle /> Approved</span>;
      case "Rejected":
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
      case "Pending":
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1"><FaClock /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <p className="ml-4 text-xl text-gray-700">Loading your bookings...</p>
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
              <FaCalendarCheck className="text-blue-600" /> Manage Bookings
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
              <FaExclamationCircle className="text-red-500 text-xl" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <FaCalendarCheck className="text-blue-400 text-6xl mx-auto mb-6" />
              <p className="text-xl text-gray-700 font-semibold mb-4">No bookings found for your properties.</p>
              <p className="text-gray-600 mb-6">Once tenants start booking your properties, their requests will appear here.</p>
              <Link
                to="/owner/add-property"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 flex items-center justify-center mx-auto w-max gap-2 transform hover:scale-105"
              >
                <FaPlusCircle /> List a New Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${bookings.indexOf(booking) * 0.1}s` }}>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <FaBuilding className="text-blue-500" /> {booking.property?.name || booking.propertyName || "N/A Property"}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>

                    <p className="text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-gray-500" /> Booked by: <span className="font-semibold">{booking.user?.name || booking.userName || "Unknown User"}</span>
                    </p>
                    <p className="text-gray-700 mb-2 flex items-center gap-2">
                      <FaPhone className="text-gray-500" /> Contact: <span className="font-semibold">{booking.user?.phone || "N/A"}</span>
                    </p>
                    <p className="text-gray-700 mb-4 flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" /> Email: <span className="font-semibold">{booking.user?.email || "N/A"}</span>
                    </p>

                    <div className="text-gray-500 text-sm mb-4">
                      Booking Date: {booking.date ? new Date(booking.date).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                      {booking.checkInDate && booking.checkOutDate && (
                        <>
                          <br /> Check-in: {new Date(booking.checkInDate).toLocaleDateString('en-NP')}
                          <br /> Check-out: {new Date(booking.checkOutDate).toLocaleDateString('en-NP')}
                        </>
                      )}
                    </div>

                    {/* Action Buttons for Pending Bookings */}
                    {booking.status === "Pending" && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() => handleBookingAction(booking._id, "Approved")}
                          disabled={actionLoadingId === booking._id}
                          className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoadingId === booking._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking._id, "Rejected")}
                          disabled={actionLoadingId === booking._id}
                          className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoadingId === booking._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                          Reject
                        </button>
                      </div>
                    )}
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
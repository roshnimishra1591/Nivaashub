import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../logo.png'; // Ensure this path is correct for your logo
import {
  FaEnvelope, FaSpinner, FaExclamationCircle, FaArrowLeft,
  FaInbox, FaUser, FaBuilding, FaClock, FaCheck, FaEye, FaTimes
} from "react-icons/fa"; // Importing various icons, added FaTimes for modal close

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAsReadId, setMarkingAsReadId] = useState(null); // To track which message is being marked
  const [popupMessage, setPopupMessage] = useState(null); // State to hold the message to display in popup
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login"); // Redirect to admin login if no token
        return;
      }
      // Assuming your backend has an endpoint like /api/admin/messages
      const res = await axios.get(`${API_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort messages to show unread first, then by date (most recent first)
      const sortedMessages = res.data.messages.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1; // Unread (false) comes before read (true)
      });
      setMessages(sortedMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err.response?.data || err.message);
      setError("Failed to load your messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    setMarkingAsReadId(messageId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Assuming a PUT endpoint like /api/admin/messages/:id/read
      await axios.put(`${API_URL}/admin/messages/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg._id === messageId ? { ...msg, isRead: true } : msg))
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err.response?.data || err.message);
      setError("Failed to mark message as read. Please try again.");
    } finally {
      setMarkingAsReadId(null);
    }
  };

  const getMessageStatusClass = (isRead) => {
    return isRead ? "bg-gray-100 text-gray-700" : "bg-blue-50 text-blue-800 font-semibold border-l-4 border-blue-500";
  };

  // Function to truncate message content for preview
  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <p className="ml-4 text-xl text-gray-700">Loading your messages...</p>
      </div>
    );
  }

  return (
    <>
      {/* Popup overlay for message details */}
      {popupMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm" onClick={() => setPopupMessage(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold" onClick={() => setPopupMessage(null)}>
                <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Message Details</h2>
            <p className="mb-1"><span className="font-semibold">From:</span> {popupMessage.senderName || popupMessage.senderEmail || 'N/A'}</p>
            {popupMessage.email && <p className="mb-1"><span className="font-semibold">Email:</span> {popupMessage.email}</p>}
            {popupMessage.phone && <p className="mb-1"><span className="font-semibold">Phone:</span> {popupMessage.phone}</p>}
            <p className="mb-1"><span className="font-semibold">Subject:</span> {popupMessage.subject || 'No Subject'}</p>
            {popupMessage.propertyName && <p className="mb-1"><span className="font-semibold">Property:</span> {popupMessage.propertyName}</p>}
            <p className="mt-4 whitespace-pre-line text-gray-700">{popupMessage.content}</p>
            <p className="mt-4 text-xs text-gray-500 text-right">Received: {new Date(popupMessage.createdAt).toLocaleString('en-NP', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
        </div>
      )}
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
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 lg:p-12 w-full max-w-4xl border border-blue-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 flex items-center gap-3">
                <FaEnvelope className="text-blue-600" /> Admin Messages
              </h2>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center gap-3 animate-fade-in">
                <FaExclamationCircle className="text-red-500 text-xl" />
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {messages.length === 0 ? (
              <div className="text-center py-16">
                <FaInbox className="text-blue-400 text-6xl mx-auto mb-6" />
                <p className="text-xl text-gray-700 font-semibold mb-4">You have no messages in your admin inbox.</p>
                <p className="text-gray-600 mb-6">All system and user communications will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Changed to a grid layout */}
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`relative p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${getMessageStatusClass(message.isRead)}`}
                    style={{ animationDelay: `${messages.indexOf(message) * 0.05}s` }}
                  >
                    {/* Status Indicator for smaller screens */}
                    {!message.isRead && (
                        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full z-10 hidden sm:block">Unread</span>
                    )}
                    {message.isRead && (
                        <span className="absolute top-2 right-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full z-10 hidden sm:block">Read</span>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <FaUser className="text-base" /> {message.senderName || message.senderEmail || "N/A Sender"}
                        {/* Optionally display property name if message is related to one */}
                        {message.propertyName && (
                            <span className="text-sm font-normal text-gray-500 flex items-center gap-1 ml-2">
                              <FaBuilding /> {truncateText(message.propertyName, 20)}
                            </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FaClock /> {new Date(message.createdAt).toLocaleString('en-NP', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    <p className="text-sm font-semibold mb-2">Subject: {message.subject || "No Subject"}</p>
                    <p className="text-base mb-4 line-clamp-2">
                      {truncateText(message.content, 150)}
                    </p>

                    <div className="flex justify-end gap-3">
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message._id)}
                          disabled={markingAsReadId === message._id}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {markingAsReadId === message._id ? <FaSpinner className="animate-spin" /> : <FaCheck />} Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => setPopupMessage(message)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

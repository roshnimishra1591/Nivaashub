import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";

export default function AdminTenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin-login");
          return;
        }
        const res = await axios.get(`${API_URL}/admin/tenants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTenant(res.data.tenant);
      } catch (err) {
        setError("Failed to load tenant details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id, API_URL, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
        <p className="text-xl text-gray-700 font-semibold">Loading tenant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600 p-4 text-center">
        <FaExclamationCircle className="text-6xl mb-4" />
        <p className="text-xl font-semibold mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700 font-semibold">Tenant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans antialiased p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 border border-blue-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-semibold mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-3">
          <FaUser className="text-blue-600" /> Tenant Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-500" />
            <span className="font-semibold">Name:</span> {tenant.name || tenant.memberName}
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-500" />
            <span className="font-semibold">Email:</span> {tenant.email}
          </div>
          {tenant.phone && (
            <div className="flex items-center gap-3">
              <FaPhone className="text-gray-500" />
              <span className="font-semibold">Phone:</span> {tenant.phone}
            </div>
          )}
          {tenant.phoneNumber && (
            <div className="flex items-center gap-3">
              <FaPhone className="text-gray-500" />
              <span className="font-semibold">Phone:</span> {tenant.phoneNumber}
            </div>
          )}
          {tenant.address && (
            <div className="flex items-center gap-3">
              <span className="font-semibold">Address:</span> {tenant.address}
            </div>
          )}
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-500" />
            <span className="font-semibold">Joined:</span> {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : (tenant.joinedAt ? new Date(tenant.joinedAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A')}
          </div>
        </div>
      </div>
    </div>
  );
}

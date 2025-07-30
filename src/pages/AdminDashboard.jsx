import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Import useLocation for active link highlighting
import axios from "axios";
import logo from '../../logo.png'; // Ensure this path is correct for your logo

// Import icons
import {
  FaHome, FaBuilding, FaUserTie, FaUserFriends, FaMoneyBillAlt,
  FaInfoCircle, FaSignOutAlt, FaSearch, FaChartPie, FaClipboardList,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationCircle,
  FaBoxOpen, FaHouseUser, FaWallet, FaUsers, FaUser, FaCalendarAlt,
  FaEnvelope, FaCog, FaArrowRight
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path for active link
  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login"); // Redirect to admin login if no token
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.type !== "admin") {
        navigate("/unauthorized"); // Redirect if not an admin
        return;
      }
    } catch (e) {
      console.error("Invalid token:", e);
      navigate("/admin-login"); // Redirect for invalid token format
      return;
    }

    // Fetch admin stats and tenants
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const statsRes = await axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
        setStats(statsRes.data.stats);

        // Assuming tenants are part of the stats or fetched separately
        const tenantsRes = await axios.get(`${API_URL}/admin/tenants/recent`, { headers: { Authorization: `Bearer ${token}` } });
        setTenants(tenantsRes.data.tenants || []); // Ensure it's an array

      } catch (err) {
        console.error("Failed to load dashboard data:", err.response?.data || err.message);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  // Define sidebar navigation items with icons and paths
  const navItems = [
    { name: "Dashboard", icon: FaChartPie, path: "/admin-dashboard" },
    { name: "Properties", icon: FaBuilding, path: "/admin/properties" },
    { name: "Owners", icon: FaUserTie, path: "/admin/owners" }, // Assuming a page for managing owners
    { name: "Tenants", icon: FaUsers, path: "/admin/tenants" }, // Assuming a page for managing tenants
    { name: "Payments", icon: FaMoneyBillAlt, path: "/admin/payments" }, // Assuming a page for payment management
    { name: "Messages", icon: FaEnvelope, path: "/admin/messages" }, // Assuming a page for admin messages
    { name: "Settings", icon: FaCog, path: "/admin/settings" }, // Assuming a general settings page
    // You can add more
  ];

  // Define stat cards with icons and dynamic colors
  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers, color: "bg-gradient-to-br from-blue-500 to-blue-700", icon: FaUsers, link: "/admin/tenants" },
    { label: "Active Properties", value: stats.activeProperties, color: "bg-gradient-to-br from-green-500 to-green-700", icon: FaBuilding, link: "/admin/properties" },
    { label: "Recent Bookings", value: stats.recentBookings, color: "bg-gradient-to-br from-yellow-500 to-yellow-700", icon: FaClipboardList, link: "/admin/bookings" },
    { label: "Pending Payments", value: stats.pendingPayments, color: "bg-gradient-to-br from-red-500 to-red-700", icon: FaWallet, link: "/admin/payments" },
  ] : [];


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-5xl mb-4" />
        <p className="text-xl text-gray-700 font-semibold">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600 p-4 text-center">
        <FaExclamationCircle className="text-6xl mb-4" />
        <p className="text-xl font-semibold mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple reload to re-attempt fetch
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-lg p-6">
        <div className="mb-10 flex flex-col items-center w-full">
          <img src={logo} alt="NivaasHub Logo" className="h-16 w-auto mb-3 filter invert hue-rotate-180 brightness-150 contrast-120" />
          <span className="text-2xl font-extrabold text-blue-300 tracking-wide">NivaasHub Admin</span>
        </div>
        <nav className="flex flex-col gap-3 w-full">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200
                ${location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <item.icon className="text-xl" />
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-6 rounded-lg text-lg font-medium text-red-300 hover:bg-gray-700 hover:text-red-100 transition-colors duration-200"
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200 z-10">
          <div className="text-2xl font-semibold text-gray-800">Admin Dashboard</div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <span className="text-gray-700 font-medium flex items-center gap-2">
                <FaUser className="text-blue-500" /> Admin User
            </span>
          </div>
        </header>

        {/* Dashboard */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">Welcome, Admin!</h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, index) => (
              <div key={index} className={`${stat.color} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-4xl font-bold">{stat.value}</div>
                    <div className="text-lg font-medium opacity-90">{stat.label}</div>
                  </div>
                  <stat.icon className="text-5xl opacity-70" />
                </div>
                <Link to={stat.link} className="text-sm font-semibold underline opacity-90 hover:opacity-100 transition-opacity flex items-center gap-2">
                  View Details <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>

          {/* Recent Tenants / New Tenants */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3 flex items-center gap-3">
              <FaUserFriends className="text-green-600" /> Recent Tenants
            </h3>
            {tenants && tenants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tenants.map((t, idx) => (
                      <tr key={t._id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                          <FaCalendarAlt className="text-xs text-gray-400"/>
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {t.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/admin/tenants/${t._id}`} className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                          {/* Add more actions if needed */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600">
                <FaBoxOpen className="text-5xl mb-4 text-gray-400 mx-auto" />
                <p className="text-lg">No recent tenants found.</p>
              </div>
            )}
            <Link to="/admin/tenants" className="text-blue-600 hover:underline mt-6 inline-block font-medium">View All Tenants <FaArrowRight className="inline-block ml-1" /></Link>
          </div>
        </main>

        <footer className="text-center text-gray-500 text-xs py-4 bg-white border-t border-gray-200">
          &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

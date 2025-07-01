import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaPlusCircle, FaBuilding, FaCalendarCheck, FaUserCog, FaSignOutAlt,
  FaHome, FaBell, FaChartLine, FaStar, FaSearch, FaCommentDots,
  FaArrowUp, FaArrowDown, FaCog, FaHistory, FaEnvelope
} from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri"; // Dashboard icon

// Assume you have these components or integrate their logic directly
// import DashboardNavbar from "../components/DashboardNavbar"; // For top bar if needed
// import Sidebar from "../components/Sidebar"; // For left navigation

// --- Dummy Sidebar Component (You should move this to a separate file like Sidebar.jsx) ---
const Sidebar = ({ ownerName, activePath, onLogout }) => {
  const navItems = [
    { name: "Dashboard", icon: RiDashboardLine, path: "/owner-dashboard" },
    { name: "Add Property", icon: FaPlusCircle, path: "/owner/add-property" },
    { name: "My Properties", icon: FaBuilding, path: "/owner/my-properties" },
    { name: "Bookings", icon: FaCalendarCheck, path: "/owner/bookings" },
    { name: "Messages", icon: FaCommentDots, path: "/owner/messages" }, // New
    { name: "Profile", icon: FaUserCog, path: "/owner/profile" },
    { name: "Settings", icon: FaCog, path: "/owner/settings" }, // New
  ];

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col h-full shadow-lg fixed md:relative z-30 transition-transform -translate-x-full md:translate-x-0">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 p-4 bg-blue-950">
        <img src="/logo.png" alt="NivaasHub Logo" className="h-10 w-10 bg-white rounded-full p-1" />
        <span className="text-xl font-bold">NivaasHub Owner</span>
      </div>

      {/* Profile Section */}
      <div className="p-4 text-center border-b border-blue-800">
        <img src="https://via.placeholder.com/80/FFFFFF/000000?text=Owner" alt="Owner Profile" className="rounded-full w-20 h-20 mx-auto mb-3 border-2 border-blue-400" />
        <h3 className="font-semibold text-lg">{ownerName}</h3>
        <p className="text-sm text-blue-200">Property Owner</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors duration-200
              ${activePath === item.path ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
          >
            <item.icon className="mr-3 text-lg" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 rounded-lg text-sm font-medium text-red-300 bg-blue-800 hover:bg-blue-700 hover:text-red-100 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};
// --- End Dummy Sidebar Component ---


export default function OwnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // To get current path for active link
  const [ownerName, setOwnerName] = useState("Owner");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [totalProperties, setTotalProperties] = useState(12);
  const [pendingBookings, setPendingBookings] = useState(3);
  const [totalEarningsMonth, setTotalEarningsMonth] = useState("NPR 35,000");
  const [propertyRatings, setPropertyRatings] = useState("4.8"); // Changed to float for consistency
  const [recentActivities, setRecentActivities] = useState([ // Dummy recent activities
    { id: 1, type: "New Booking", description: "Property 'Cozy Studio' booked by John Doe.", time: "2 hours ago", icon: FaCalendarCheck, color: "text-green-500" },
    { id: 2, type: "Property Updated", description: "Details updated for 'Spacious Apartment'.", time: "Yesterday", icon: FaBuilding, color: "text-blue-500" },
    { id: 3, type: "New Message", description: "You have a new message from Jane Smith.", time: "3 days ago", icon: FaEnvelope, color: "text-yellow-500" },
  ]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/owner-login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setOwnerName(payload.name || "Owner"); // Assuming payload has owner name
      if (payload.type !== "owner") {
        navigate("/owner-login");
      }
    } catch (e) {
      console.error("Token validation failed:", e);
      navigate("/owner-login");
    }

    // --- Simulate API calls for real-time data ---
    const fetchDashboardStats = () => {
      // In a real app, replace with actual backend API calls
      // e.g., axios.get('/api/owner/dashboard-stats').then(res => { setTotalProperties(res.data.count); ... });
      console.log("Fetching owner dashboard stats...");
    };
    fetchDashboardStats();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/owner-login");
  };

  const handleViewNotifications = () => {
    alert("Viewing notifications!"); // Replace with actual notification page/modal
    setUnreadNotifications(0); // Clear dummy count
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar ownerName={ownerName} activePath={location.pathname} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64"> {/* Adjust margin for sidebar */}
        {/* Top Header/Navbar for Dashboard */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {/* This button would toggle mobile sidebar visibility */}
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, bookings, etc."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={handleViewNotifications}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-110"
                title="Notifications"
              >
                <FaBell size={20} />
              </button>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse-once">
                  {unreadNotifications}
                </span>
              )}
            </div>
            {/* User Profile Dropdown Placeholder */}
            <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                    <img src="https://via.placeholder.com/30/FFFFFF/000000?text=O" alt="Profile" className="w-8 h-8 rounded-full border border-gray-300" />
                    <span className="font-medium text-gray-700 hidden sm:block">{ownerName}</span>
                </button>
                {/* Dummy Dropdown Content */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/owner/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100"><FaUserCog className="inline-block mr-2" /> Profile</Link>
                    <Link to="/owner/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100"><FaCog className="inline-block mr-2" /> Settings</Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"><FaSignOutAlt className="inline-block mr-2" /> Logout</button>
                </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-2">
            <RiDashboardLine className="text-blue-600" /> Dashboard Overview
          </h2>
          <p className="text-md text-gray-600 mb-8 max-w-2xl">
            A snapshot of your NivaasHub activities. Quickly access key metrics and manage your properties, bookings, and profile.
          </p>

          {/* Key Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-3">
                <FaBuilding size={32} className="opacity-80" />
                <span className="text-sm opacity-90">Total Properties</span>
              </div>
              <p className="text-4xl font-extrabold">{totalProperties}</p>
              <div className="text-xs opacity-70 mt-2">
                <span className="text-green-300 font-bold flex items-center"><FaArrowUp className="mr-1" /> 2 New this month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-3">
                <FaCalendarCheck size={32} className="opacity-80" />
                <span className="text-sm opacity-90">Pending Bookings</span>
              </div>
              <p className="text-4xl font-extrabold">{pendingBookings}</p>
              <div className="text-xs opacity-70 mt-2">
                <span className="text-red-300 font-bold flex items-center"><FaArrowDown className="mr-1" /> 1 Overdue</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-3">
                <FaChartLine size={32} className="opacity-80" />
                <span className="text-sm opacity-90">Monthly Earnings</span>
              </div>
              <p className="text-4xl font-extrabold">{totalEarningsMonth}</p>
              <div className="text-xs opacity-70 mt-2">
                <span className="text-blue-200 font-medium">📈 +15% from last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-3">
                <FaStar size={32} className="opacity-80" />
                <span className="text-sm opacity-90">Average Rating</span>
              </div>
              <p className="text-4xl font-extrabold">{propertyRatings} <span className="text-xl">/ 5</span></p>
              <div className="text-xs opacity-70 mt-2">
                <span className="text-yellow-300 font-bold flex items-center"><FaStar className="mr-1" /> Excellent!</span>
              </div>
            </div>
          </section>

          {/* Action Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <DashboardCard
              icon={FaPlusCircle}
              title="Add New Property"
              description="Seamlessly list your next room or rental space for tenants to discover."
              buttonText="List Property"
              buttonAction={() => navigate("/owner/add-property")}
              buttonColor="bg-blue-600 hover:bg-blue-700"
            />
            <DashboardCard
              icon={FaBuilding}
              title="Manage Properties"
              description="View, edit, and update all properties you've listed on NivaasHub."
              buttonText="View All"
              buttonAction={() => navigate("/owner/my-properties")}
              buttonColor="bg-green-600 hover:bg-green-700"
            />
            <DashboardCard
              icon={FaCalendarCheck}
              title="Track Bookings"
              description="Monitor booking statuses, approve requests, and manage your calendar."
              buttonText="View Bookings"
              buttonAction={() => navigate("/owner/bookings")}
              buttonColor="bg-yellow-600 text-blue-900 hover:bg-yellow-700"
            />
             <DashboardCard
              icon={FaCommentDots}
              title="Messages"
              description="Respond to inquiries and communicate directly with potential and current tenants."
              buttonText="View Messages"
              buttonAction={() => navigate("/owner/messages")}
              buttonColor="bg-purple-600 hover:bg-purple-700"
            />
            <DashboardCard
              icon={FaUserCog}
              title="Profile Settings"
              description="Keep your personal and contact details up-to-date and manage security settings."
              buttonText="Edit Profile"
              buttonAction={() => navigate("/owner/profile")}
              buttonColor="bg-gray-700 hover:bg-gray-800"
            />
            <DashboardCard
              icon={FaCog}
              title="Account Settings"
              description="Manage your subscription, notifications preferences, and other account-wide settings."
              buttonText="Adjust Settings"
              buttonAction={() => navigate("/owner/settings")}
              buttonColor="bg-indigo-600 hover:bg-indigo-700"
            />
          </section>

          {/* Recent Activity Section */}
          <section className="bg-white rounded-xl shadow-lg p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <FaHistory className="text-blue-600" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <activity.icon className={`text-2xl mr-4 ${activity.color}`} />
                    <div>
                      <p className="font-semibold text-gray-800">{activity.type}: {activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity.</p>
              )}
            </div>
            <button className="mt-6 text-blue-600 font-semibold hover:underline flex items-center gap-2">
                View All Activity <FaArrowUp className="rotate-45" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

// --- Reusable Dashboard Card Component ---
const DashboardCard = ({ icon: Icon, title, description, buttonText, buttonAction, buttonColor }) => (
  <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between items-center text-center">
    <Icon size={48} className={`text-blue-600 mb-4`} /> {/* Icon color can be dynamic too */}
    <h3 className="text-xl font-bold text-blue-800 mb-2">{title}</h3>
    <p className="text-gray-700 mb-5 leading-relaxed">{description}</p>
    <button
      onClick={buttonAction}
      className={`w-full ${buttonColor} text-white px-6 py-3 rounded-lg transition duration-300 font-semibold flex items-center justify-center gap-2`}
    >
      <Icon className="text-lg" /> {buttonText}
    </button>
  </div>
);
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";

export default function DashboardNavbar({ onLogout, onDashboard }) {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="NivaasHub Logo" className="h-9 w-9 bg-white rounded-full p-1" />
          <span className="text-2xl font-bold">NivaasHub Owner</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onDashboard}
            className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RiDashboardLine className="mr-2" /> Dashboard
          </button>
          <button
            onClick={onLogout}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

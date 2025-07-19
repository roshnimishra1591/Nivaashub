import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { HiMenu } from "react-icons/hi";

export default function DashboardNavbar({ onLogout, onDashboard }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="NivaasHub Logo" className="h-9 w-9 bg-white rounded-full p-1" />
          <span className="text-lg sm:text-2xl font-bold">NivaasHub Owner</span>
        </div>
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            <HiMenu className="h-7 w-7" />
          </button>
        </div>
        <div className={`flex-col sm:flex-row flex items-center gap-2 sm:gap-4 absolute sm:static top-16 right-4 bg-blue-800 sm:bg-transparent rounded-md p-4 sm:p-0 shadow-lg sm:shadow-none z-50 transition-all duration-200 ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
          <button
            onClick={onDashboard}
            className="items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors hidden sm:inline-flex"
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

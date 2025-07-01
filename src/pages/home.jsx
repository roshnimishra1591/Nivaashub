import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaBed, FaBath, FaVectorSquare } from "react-icons/fa"; // Imported icons for better aesthetics
import NavBar from "../components/NavBar";
import MembershipPopup from "../components/MembershipPopup";

const properties = [
  {
    price: "Rs. 24,000",
    address: "Baluwatar, Kathmandu",
    bedrooms: 3,
    bathrooms: 4,
    area: "360m²",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80",
  },
  {
    price: "Rs. 32,000",
    address: "Nayabazar, Pokhara",
    bedrooms: 6,
    bathrooms: 5,
    area: "2000m²",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
  },
  {
    price: "Rs. 12,000",
    address: "Biratnagar-2, Morang",
    bedrooms: 4,
    bathrooms: 2,
    area: "280m²",
    image:
      "https://images.unsplash.com/photo-1613977257363-dc07c7c4c9c7?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Homepage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saleRentToggle, setSaleRentToggle] = useState("sale"); // New state for toggle
  const dropdownOpenRef = useRef(false); // Consider if this ref is still needed or can be removed
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const openTimeout = useRef();

  // Only one useEffect for popup logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(true);
    if (!token) {
      setIsMember(false);
      setShowPopup(true);
      setLoading(false);
      return;
    }
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.isMember === true) {
            setIsMember(true);
            setShowPopup(false);
          } else {
            setIsMember(false);
            setShowPopup(true);
          }
        } else {
          setIsMember(false);
          setShowPopup(true);
        }
      })
      .catch(() => {
        setIsMember(false);
        setShowPopup(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsMember(false);
    setShowPopup(true);
    navigate("/");
  };

  const handleStartMembership = () => {
    if (isLoggedIn) {
      navigate("/membership-plans");
    } else {
      navigate("/login");
    }
  };

  const handleMouseEnter = () => {
    if (isLoggedIn) {
      clearTimeout(openTimeout.current);
      openTimeout.current = setTimeout(() => setDropdownOpen(true), 1000); // Increased delay for smoother UX
    }
  };

  const handleMouseLeave = () => {
    if (isLoggedIn) {
      clearTimeout(openTimeout.current);
      openTimeout.current = setTimeout(() => setDropdownOpen(false), 300); // Reduced delay for quicker close
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(openTimeout.current);
    };
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans antialiased">
      {/* Membership Popup */}
      <MembershipPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onStart={handleStartMembership}
        forceHide={isMember}
      />

      {/* Header Section */}
      <header
        className="relative bg-gradient-to-r from-blue-950/80 to-blue-800/60 text-white pb-24 lg:pb-40 overflow-hidden"
        style={{
          backgroundImage: "url('/main.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center", // Ensures image is centered
        }}
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-blue-800/60 pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-6 z-20">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 bg-white rounded-full p-1 shadow-lg" // Larger logo
            />
            <h1 className="text-3xl font-extrabold tracking-tight"> {/* Bolder and larger text */}
              NivaasHub
            </h1>
          </div>
          <NavBar />
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isLoggedIn ? (
              <>
                <button
                  ref={buttonRef}
                  className="bg-white/70 text-blue-900 px-5 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2 backdrop-blur-sm hover:bg-white/90 transition duration-300 ease-in-out transform hover:scale-105" // Enhanced hover
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  My Profile{" "}
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`absolute right-0 mt-2 w-40 bg-white/90 border border-gray-200/50 rounded-lg shadow-xl z-30 backdrop-blur-md transform origin-top-right transition-all duration-300 ${
                      dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 rounded-t-lg hover:bg-blue-50 text-blue-600 font-medium transition duration-200"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 rounded-b-lg hover:bg-red-50 text-red-600 font-medium transition duration-200"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="bg-white text-blue-900 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105" // Enhanced hover
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            )}
          </div>
        </nav>

        {/* Hero Section Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 drop-shadow-xl text-shadow-lg"> {/* Added text-shadow */}
              Sell or rent your home at the best price
            </h2>
            <div className="flex justify-center md:justify-start mb-6">
              <button
                className={`px-6 py-3 rounded-l-lg font-bold shadow-md transition duration-300 ${
                  saleRentToggle === "sale"
                    ? "bg-white text-blue-900 hover:bg-blue-100"
                    : "bg-transparent border border-white text-white hover:bg-white/10" // Toggle styling
                }`}
                onClick={() => setSaleRentToggle("sale")}
              >
                Sale
              </button>
              <button
                className={`px-6 py-3 rounded-r-lg font-semibold shadow-md transition duration-300 ${
                  saleRentToggle === "rent"
                    ? "bg-white text-blue-900 hover:bg-blue-100"
                    : "bg-transparent border border-white text-white hover:bg-white/10" // Toggle styling
                }`}
                onClick={() => setSaleRentToggle("rent")}
              >
                Rent
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center gap-3 mb-6"> {/* Larger padding, deeper shadow */}
              <select className="flex-shrink-0 w-full sm:w-auto px-4 py-3 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"> {/* Stronger focus ring */}
                <option>Property type</option>
                <option>House</option>
                <option>Apartment</option>
              </select>
              <input
                className="flex-grow w-full px-4 py-3 text-gray-700 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200" // Stronger focus ring
                placeholder="Search by location or Property ID..."
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 w-full sm:w-auto transform hover:scale-105 shadow-lg"> {/* Added hover scale, shadow */}
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-sm text-white/90">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition duration-200">
                <input type="checkbox" className="accent-blue-400 w-4 h-4" />
                Only exclusive properties
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition duration-200">
                <input type="checkbox" className="accent-blue-400 w-4 h-4" />
                Only new developments
              </label>
            </div>
          </div>
        </div>
      </header>

      ---

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-800 leading-snug">
            Let's Meet <span className="text-blue-600">NivaasHub!</span> 🔥
          </h3>
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            Historic property of noble families over the centuries, three of the
            Italian royalty, the castle has 8 bedrooms and numerous reception
            rooms spread over approximately 1,000 m² of living area.
          </p>
          <div className="flex justify-center md:justify-start gap-16 mb-8">
            <div>
              <p className="text-3xl font-bold text-blue-700 drop-shadow-md">1,000 m²</p> {/* Added subtle shadow */}
              <p className="text-sm text-gray-500 mt-1">Living Area</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700 drop-shadow-md">8 Bedrooms</p> {/* Added subtle shadow */}
              <p className="text-sm text-gray-500 mt-1">Bedroom</p>
            </div>
          </div>
          <a
            href="/rooms"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105" // Added hover scale
          >
            See more details <span className="ml-2">→</span>
          </a>
        </div>
        <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            ["For Buyers", "We work with local experts."],
            ["For Sellers", "We find the best buyers."],
            ["Valuation", "Get accurate price estimates."],
          ].map(([title, desc], idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"> {/* Added inner shadow */}
                {/* Generic SVG, consider replacing with specific icons */}
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <p className="font-bold text-lg text-gray-800 mb-2">{title}</p>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      ---

      {/* Latest Properties Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4 sm:px-6"> {/* Enhanced gradient */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-extrabold mb-12 text-center text-gray-800">
            Latest Property For Sale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={property.image}
                  alt="Property"
                  className="h-52 w-full object-cover mb-4 rounded-t-xl"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    {property.price}
                  </div>
                  <div className="text-gray-700 text-base mb-3 leading-snug">
                    {property.address}
                  </div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    <span className="flex items-center gap-1">
                      <FaBed className="w-4 h-4 text-blue-500" /> {/* Using FaBed icon */}
                      {property.bedrooms} Bedrooms
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBath className="w-4 h-4 text-blue-500" /> {/* Using FaBath icon */}
                      {property.bathrooms} Bathrooms
                    </span>
                    <span className="flex items-center gap-1">
                      <FaVectorSquare className="w-4 h-4 text-blue-500" /> {/* Using FaVectorSquare icon */}
                      {property.area}
                    </span>
                  </div>
                  <button className="mt-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"> {/* Added hover scale, shadow */}
                    More info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h3 className="text-3xl font-extrabold mb-12 text-center text-gray-800">
          What our clients are{" "}
          <span className="text-blue-600">saying about us</span>
        </h3>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="bg-blue-50 rounded-2xl p-8 flex-1 shadow-lg border border-blue-100 relative overflow-hidden">
            <blockquote className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-md">
                  Trustpilot
                </span>
                <span className="text-gray-700 text-sm font-medium">5.0</span>
              </div>
              <p className="text-gray-800 text-lg mb-4 italic leading-relaxed">
                "Excellent value and service! The team helped me find the best
                price for my home and made the process easy."
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                - Lawrence, Home Seller
              </p>
            </blockquote>
            {/* Decorative background elements for aesthetic - increased blur */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-xl"></div> {/* Increased blur */}
            <div className="absolute -top-5 -left-5 w-20 h-20 bg-blue-200 rounded-full opacity-30 blur-lg"></div> {/* Increased blur */}
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80"
              alt="Living room"
              className="rounded-3xl w-full max-w-lg h-60 object-cover shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </section>

      ---

      {/* Footer Section */}
      <div className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
      </div>
    </div>
  );
}
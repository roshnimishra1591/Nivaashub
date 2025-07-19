import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Updated imported icons for better aesthetics and specific usage in features
import { FaChevronDown, FaBed, FaBath, FaVectorSquare, FaStar, FaUserCircle, FaSearch, FaTag, FaDollarSign } from "react-icons/fa";
import NavBar from "../components/NavBar";
import MembershipPopup from "../components/MembershipPopup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Homepage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saleRentToggle, setSaleRentToggle] = useState("sale"); // New state for toggle
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const openTimeout = useRef();

  // New state for top properties
  const [topProperties, setTopProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // State for controlling how many properties to show
  const [visibleCount, setVisibleCount] = useState(3);

  // --- Top Reviewed Property State ---
  const [topReviewed, setTopReviewed] = useState(null);
  const [topReviews, setTopReviews] = useState([]);

  // Only one useEffect for popup logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(true);
    if (!token) {
      setIsMember(false);
      setShowPopup(false); // Do not show popup if not logged in
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
            // Show popup only for logged in users without membership and only if not explicitly closed
            const popupClosed = localStorage.getItem('membershipPopupClosed');
            setShowPopup(popupClosed !== 'true');
          }
        } else {
          setIsMember(false);
          setShowPopup(false); // Do not show popup if not logged in
        }
      })
      .catch(() => {
        setIsMember(false);
        setShowPopup(false); // Do not show popup if not logged in
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch top properties from backend (same as rooms page, but limit to 3)
  useEffect(() => {
    setPropertiesLoading(true);
    fetch("http://localhost:5000/api/owner/all-properties")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.properties) {
          // Sort by createdAt (newest first) and take top 3
          const sorted = [...data.properties].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTopProperties(sorted.slice(0, 3));
        } else {
          setTopProperties([]);
        }
      })
      .catch(() => setTopProperties([]))
      .finally(() => setPropertiesLoading(false));
  }, []);

  // Fetch top reviewed property and its reviews
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/top-reviews/top-reviewed`)
      .then((res) => res.json())
      .then((data) => {
        setTopReviewed(data.property);
        setTopReviews(data.reviews || []);
      })
      .catch(() => {
        setTopReviewed(null);
        setTopReviews([]);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsMember(false);
    localStorage.setItem('membershipPopupClosed', 'false'); // Reset popup state on logout
    setShowPopup(true); // Show popup after logout
    navigate("/");
  };

  const handleStartMembership = () => {
    if (isLoggedIn) {
      navigate("/membership-plans");
    } else {
      navigate("/login");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.setItem('membershipPopupClosed', 'true'); // Remember user closed it
  };

  const handleMouseEnter = () => {
    if (isLoggedIn) {
      clearTimeout(openTimeout.current);
      openTimeout.current = setTimeout(() => setDropdownOpen(true), 300); // Shorter delay for smoother UX
    }
  };

  const handleMouseLeave = () => {
    if (isLoggedIn) {
      clearTimeout(openTimeout.current);
      openTimeout.current = setTimeout(() => setDropdownOpen(false), 200); // Shorter delay for quicker close
    }
  };

  // Add state for search input and property type
  const [searchInput, setSearchInput] = useState("");
  const [searchPropertyType, setSearchPropertyType] = useState("");

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const params = [];
    if (searchInput.trim() !== "") {
      params.push(`search=${encodeURIComponent(searchInput.trim())}`);
    }
    if (searchPropertyType && searchPropertyType !== "Property type") {
      params.push(`type=${encodeURIComponent(searchPropertyType)}`);
    }
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    navigate(`/rooms${query}`);
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
        onClose={handlePopupClose} // Use the new handler
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
              alt="NivaasHub Logo"
              className="w-14 h-14 bg-white rounded-full p-1 shadow-lg" // Larger logo
            />
            <h1 className="text-3xl font-extrabold tracking-tight">
              {" "}
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
                  className="bg-white/70 text-blue-900 px-8 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2 backdrop-blur-sm hover:bg-white/90 transition duration-300 ease-in-out transform hover:scale-105" // Enhanced hover
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
                 className="hidden sm:inline-block bg-white text-blue-900 px-8 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105"
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
            <form className="bg-white rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center gap-3 mb-6" onSubmit={handleSearch}> {/* Larger padding, deeper shadow */}
              <select
                className="flex-shrink-0 w-full sm:w-auto px-4 py-3 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                value={searchPropertyType}
                onChange={e => setSearchPropertyType(e.target.value)}
                name="propertyType"
              >
                <option>Property type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
                <option>Villa</option>
                <option>Land</option>
              </select>
              <input
                className="flex-grow w-full px-4 py-3 text-gray-700 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200" // Stronger focus ring
                placeholder="Search by location or Property ID..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                name="search"
              />
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 w-full sm:w-auto transform hover:scale-105 shadow-lg"> {/* Added hover scale, shadow */}
                Search
              </button>
            </form>
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
            { title: "For Buyers", desc: "We work with local experts.", icon: FaSearch },
            { title: "For Sellers", desc: "We find the best buyers.", icon: FaTag },
            { title: "Valuation", desc: "Get accurate price estimates.", icon: FaDollarSign },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"> {/* Added inner shadow */}
                {/* Dynamically rendered icon */}
                <feature.icon className="w-8 h-8" />
              </div>
              <p className="font-bold text-lg text-gray-800 mb-2">{feature.title}</p>
              <p className="text-sm text-gray-600">{feature.desc}</p>
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
          {propertiesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
              <p className="ml-4 text-lg text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {topProperties.slice(0, visibleCount).map((property, idx) => (
                  <div
                    key={property._id || idx}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? `${API_BASE_URL}/uploads/${typeof property.images[0] === 'string' ? property.images[0] : ''}`
                          : 'https://via.placeholder.com/400x300/F3F4F6?text=No+Image'
                      }
                      alt={property.title || 'Property Image'}
                      className="h-52 w-full object-cover mb-4 rounded-t-xl"
                    />
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-2xl font-bold text-blue-700 mb-2">
                        NPR {property.price ? property.price.toLocaleString() : 'N/A'}
                      </div>
                      <div className="text-gray-700 text-base mb-3 leading-snug">
                        {property.address || 'Address not available'}
                      </div>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 mb-4">
                        <span className="flex items-center gap-1">
                          <FaBed className="w-4 h-4 text-blue-500" />
                          {property.bedrooms || 'N/A'} Bedrooms
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBath className="w-4 h-4 text-blue-500" />
                          {property.bathrooms || 'N/A'} Bathrooms
                        </span>
                        <span className="flex items-center gap-1">
                          <FaVectorSquare className="w-4 h-4 text-blue-500" />
                          {property.area || 'N/A'}
                        </span>
                      </div>
                      {/* New method: Show property type and posted date */}
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {property.type || 'Property'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Instead of Show More button, show a link to the Rooms page if there are more properties */}
              <div className="flex justify-center mt-10">
                <a
                  href="/rooms"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  See All Properties
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      ---

      {/* Testimonials Section replaced with dynamic top reviewed property reviews */}
      {topReviewed && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h3 className="text-3xl font-extrabold mb-12 text-center text-gray-800">
            What our clients are <span className="text-blue-600">saying about our top property</span>
          </h3>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="bg-blue-50 rounded-2xl p-8 flex-1 shadow-lg border border-blue-100 relative overflow-hidden">
              <h4 className="text-xl font-bold text-blue-800 mb-4 text-center md:text-left">
                {topReviewed.title || 'Property'}
              </h4>
              <div className="mb-4 text-gray-600 text-center md:text-left">{topReviewed.address || 'Address not available'}</div>
              <div className="max-h-80 overflow-y-auto space-y-4 custom-scrollbar"> {/* Added custom-scrollbar class for styling */}
                {topReviews.length === 0 ? (
                  <div className="text-gray-500 text-center">No reviews yet for this property.</div>
                ) : (
                  topReviews.map((review, idx) => (
                    <div key={review._id || idx} className="bg-white rounded-lg p-4 shadow border border-blue-100 mb-2">
                      <div className="flex items-center mb-2">
                        <FaUserCircle className="text-gray-400 text-2xl mr-2" />
                        <span className="font-semibold text-gray-800">{review.reviewerName || 'Anonymous'}</span>
                        <span className="ml-4 flex items-center text-yellow-500 text-sm"><FaStar className="mr-1" /> {review.rating}</span>
                      </div>
                      <div className="text-gray-700 italic mb-1">"{review.comment}"</div>
                      <div className="text-xs text-gray-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
                    </div>
                  ))
               )}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={
                  topReviewed.images && topReviewed.images.length > 0
                    ? `${API_BASE_URL}/uploads/${typeof topReviewed.images[0] === 'string' ? topReviewed.images[0] : ''}`
                    : 'https://via.placeholder.com/400x300/F3F4F6?text=No+Image'
                }
                alt={topReviewed.title || 'Property Image'}
                className="rounded-3xl w-full max-w-lg h-60 object-cover shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition duration-500 ease-in-out"
              />
            </div>
          </div>
        </section>
      )}

      ---

      {/* Footer Section */}
      <div className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
      </div>
    </div>
  );
}
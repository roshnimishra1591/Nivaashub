import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import roomsBg from '../assets/rooms-bg.png';
import { FaBed, FaBath, FaVectorSquare, FaMapMarkerAlt, FaTag, FaDollarSign, FaLock, FaSearch, FaFilter, FaTimes, FaExclamationCircle } from 'react-icons/fa'; // Added FaExclamationCircle
import { FaStar } from 'react-icons/fa';
import { fetchAllReviews, fetchPropertyReviews } from '../apiReviews';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Rooms() {
  const locationRouter = useLocation();
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allReviews, setAllReviews] = useState([]);

  // --- Filter States ---
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false); // State to toggle filter visibility on small screens

  // Fetch all properties on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      axios.get('http://localhost:5000/api/owner/all-properties')
        .then(res => {
          setAllProperties(res.data.properties);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch properties:", err);
          setError('Failed to load properties. Please try again later.');
          setLoading(false);
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all reviews on component mount
  useEffect(() => {
    fetchAllReviews().then(setAllReviews).catch(() => setAllReviews([]));
  }, []);

  // On mount, set searchQuery and propertyType from URL if present
  useEffect(() => {
    const params = new URLSearchParams(locationRouter.search);
    const search = params.get('search');
    const type = params.get('type');
    if (search) {
      setSearchQuery(search);
    }
    if (type) {
      setPropertyType(type);
    }
  }, [locationRouter.search]);

  // Effect to apply filters whenever filter states or allProperties change
  useEffect(() => {
    let currentProperties = [...allProperties];

    // 1. Search Query Filter (on title, description, address)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentProperties = currentProperties.filter(property =>
        (property.title && property.title.toLowerCase().includes(lowerCaseQuery)) ||
        (property.description && property.description.toLowerCase().includes(lowerCaseQuery)) ||
        (property.address && property.address.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // 2. Property Type Filter
    if (propertyType) {
      currentProperties = currentProperties.filter(property => property.type === propertyType);
    }

    // 3. Price Range Filter
    if (minPrice !== '') {
      currentProperties = currentProperties.filter(property => property.price >= parseInt(minPrice));
    }
    if (maxPrice !== '') {
      currentProperties = currentProperties.filter(property => property.price <= parseInt(maxPrice));
    }

    // 4. Bedrooms Filter
    if (minBedrooms !== '') {
      currentProperties = currentProperties.filter(property => property.bedrooms >= parseInt(minBedrooms));
    }

    // 5. Bathrooms Filter
    if (minBathrooms !== '') {
      currentProperties = currentProperties.filter(property => property.bathrooms >= parseInt(minBathrooms));
    }

    // 6. Location Filter
    if (location) {
      const lowerCaseLocation = location.toLowerCase();
      currentProperties = currentProperties.filter(property =>
        property.address && property.address.toLowerCase().includes(lowerCaseLocation)
      );
    }

    // 7. Sort Order
    if (sortOrder) {
      currentProperties.sort((a, b) => {
        if (sortOrder === 'price_asc') {
          return a.price - b.price;
        } else if (sortOrder === 'price_desc') {
          return b.price - a.price;
        } else if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt); // Assuming 'createdAt' field
        }
        return 0;
      });
    }

    setFilteredProperties(currentProperties);
  }, [allProperties, propertyType, minPrice, maxPrice, minBedrooms, minBathrooms, location, searchQuery, sortOrder]);


  const handleClearFilters = () => {
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinBathrooms('');
    setLocation('');
    setSearchQuery('');
    setSortOrder('');
    setShowMobileFilters(false); // Close filters after clearing on mobile
  };

  const propertyTypes = ['Apartment', 'House', 'Condo', 'Villa', 'Land']; // Example types
  const commonLocations = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar']; // Example locations
  const bedBathOptions = [1, 2, 3, 4, 5]; // Example bed/bath options


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 font-sans antialiased">
      {/* Header Section with Hero */}
      <header
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center flex flex-col justify-center items-center overflow-hidden shadow-xl"
        style={{ backgroundImage: `url(${roomsBg})` }}
      >
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-blue-700/50" />

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-white text-center px-6 pt-20 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 drop-shadow-2xl leading-tight">
            Explore Your Next Home
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mt-4 max-w-3xl mx-auto text-blue-100 drop-shadow-lg">
            Dive into our carefully curated selection of available rooms and properties. Your perfect space awaits!
          </p>
        </div>
      </header>

      {/* Main Content Area - Updated to Flex Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 flex flex-col md:flex-row gap-8">

        {/* Mobile Filter Toggle & Search Bar (Top for small screens) */}
        <div className="md:hidden w-full mb-4">
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
            {/* Search Input for Mobile */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
              <FaSearch className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search by keyword, address..."
                className="w-full py-2 px-1 text-gray-700 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Mobile Filter Toggle Button */}
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-300 shadow-md"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FaFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>


        {/* Filter Column (Left Side) */}
        <div className={`md:w-64 lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'} md:block bg-white rounded-xl shadow-lg p-6 md:p-4 self-start sticky top-28 md:max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar`}>
          <div className="flex justify-between items-center mb-6 md:mb-4">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <FaFilter /> Filters
            </h3>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setShowMobileFilters(false)}
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="space-y-6 md:space-y-4"> {/* Compact spacing for filters */}
            {/* Sort By */}
            <div>
              <label htmlFor="sortOrder" className="block text-gray-700 text-sm font-semibold mb-2">Sort By</label>
              <select
                id="sortOrder"
                className="form-select w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Default</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-gray-700 text-sm font-semibold mb-2">Property Type</label>
              <select
                id="propertyType"
                className="form-select w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Price Range (NPR)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="form-input w-1/2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="form-input w-1/2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
              <select
                id="location"
                className="form-select w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Any Location</option>
                {commonLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Min Bedrooms */}
            <div>
              <label htmlFor="minBedrooms" className="block text-gray-700 text-sm font-semibold mb-2">Min Bedrooms</label>
              <select
                id="minBedrooms"
                className="form-select w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                {bedBathOptions.map(num => <option key={`bed-${num}`} value={num}>{num}+</option>)}
              </select>
            </div>

            {/* Min Bathrooms */}
            <div>
              <label htmlFor="minBathrooms" className="block text-gray-700 text-sm font-semibold mb-2">Min Bathrooms</label>
              <select
                id="minBathrooms"
                className="form-select w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={minBathrooms}
                onChange={(e) => setMinBathrooms(e.target.value)}
              >
                <option value="">Any</option>
                {bedBathOptions.map(num => <option key={`bath-${num}`} value={num}>{num}+</option>)}
              </select>
            </div>

            {/* Clear Filters Button for Desktop */}
            <button
              className="w-full bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 shadow-sm flex items-center justify-center gap-2 mt-4"
              onClick={handleClearFilters}
            >
              Clear All <FaTimes />
            </button>
          </div>
        </div>

        {/* Property Grid (Right Side) */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center md:text-left">
            Available Properties
          </h2>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <p className="ml-4 text-xl text-gray-600">Loading amazing properties...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center" role="alert">
              <strong className="font-bold">Oops!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          ) : filteredProperties.length === 0 ? (
            /* No Properties Found State */
            <div className="text-center py-20 text-gray-600">
              <p className="text-2xl font-semibold mb-4">No properties found matching your criteria.</p>
              <p className="text-lg">Try adjusting your filters or clearing them.</p>
              <button
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Properties Grid - Adjusted for 2 columns */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProperties.map((room, idx) => {
                const isLocked = room.membersOnly;
                // Get reviews for this property
                const propertyReviews = allReviews.filter(r => r.propertyId === room._id);
                const avgRating = propertyReviews.length > 0 ? (propertyReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / propertyReviews.length).toFixed(1) : null;
                return (
                  <div
                    key={room._id || idx}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col overflow-hidden group cursor-pointer relative`}
                    tabIndex={isLocked ? -1 : 0}
                    aria-disabled={isLocked}
                    onClick={e => {
                      if (isLocked) {
                        e.preventDefault();
                        e.stopPropagation();
                        alert('This is a members-only property. Please activate membership to view details.');
                        return;
                      }
                      window.location.href = `/property/${room._id}`;
                    }}
                    onKeyDown={e => {
                      if (isLocked && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        e.stopPropagation();
                        alert('This is a members-only property. Please activate membership to view details.');
                      } else if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
                        window.location.href = `/property/${room._id}`;
                      }
                    }}
                    style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={
                          room.images && room.images.length > 0
                            ? (room.images[0].url
                                ? room.images[0].url
                                : `${API_BASE_URL}/uploads/${typeof room.images[0] === 'string' ? room.images[0] : ''}`)
                            : 'https://via.placeholder.com/400x300/F3F4F6/9CA3AF?text=No+Image'
                        }
                        alt={room.title || 'Property Image'}
                        className={`w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110 ${isLocked ? 'filter blur-sm grayscale' : ''}`}
                      />
                      {room.isFeatured && (
                        <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Featured
                        </span>
                      )}
                      {isLocked && (
                        <>
                          <span className="absolute top-3 right-3 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
                            Members Only
                          </span>
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10" style={{ pointerEvents: 'auto' }} onClick={e => e.stopPropagation()}>
                            <FaLock className="text-white text-4xl mb-2" />
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold mt-2 hover:bg-blue-700 transition"
                              onClick={e => {
                                e.stopPropagation();
                                window.location.href = '/membership-plans';
                              }}
                            >
                              Activate Membership
                            </button>
                            <span className="text-white mt-2 text-sm">Members only property</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className={`p-6 flex flex-col flex-grow ${isLocked ? 'opacity-60' : ''}`}>
                      <h3 className="text-2xl font-bold text-blue-800 mb-2 leading-tight">
                        {room.title || 'Untitled Property'}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FaMapMarkerAlt className="text-blue-500 mr-2 flex-shrink-0" />
                        <span className="truncate">{room.address || 'Address not available'}</span>
                      </div>
                      <div className="text-blue-700 text-3xl font-extrabold mb-3 flex items-center gap-1">
                        {/* Replaced FaDollarSign with NPR sign */}
                        <span className="font-bold text-blue-600 text-xl">NPR</span> {room.price ? room.price.toLocaleString() : 'N/A'}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <FaTag className="text-blue-400 mr-1" />
                          {room.type || 'N/A'}
                        </span>
                        <span className="flex items-center">
                          <FaBed className="text-blue-400 mr-1" />
                          {room.bedrooms || 'N/A'} Beds
                        </span>
                        <span className="flex items-center">
                          <FaBath className="text-blue-400 mr-1" />
                          {room.bathrooms || 'N/A'} Baths
                        </span>
                        {room.area && (
                          <span className="flex items-center">
                            <FaVectorSquare className="text-blue-400 mr-1" />
                            {room.area}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 text-base mb-4 line-clamp-3">
                        {room.description || 'No description available for this property.'}
                      </p>
                      {/* Avg Review and All Reviews */}
                      <div className="mt-2 mb-2">
                        {avgRating ? (
                          <div className="flex items-center gap-2 text-yellow-600 font-bold text-lg">
                            <FaStar className="text-yellow-400" /> {avgRating} / 5
                            <span className="text-gray-500 text-sm">({propertyReviews.length} reviews)</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">No reviews yet</div>
                        )}
                      </div>
                      {propertyReviews.length > 0 && (
                        <div className="max-h-32 overflow-y-auto space-y-2 border-t pt-2 mt-2">
                          {propertyReviews.map((review, i) => (
                            <div key={review._id || i} className="text-sm text-gray-700 border-b pb-1 mb-1">
                              <span className="font-semibold text-blue-700">{review.reviewerName || 'Anonymous'}:</span> {review.comment} <span className="text-yellow-500"><FaStar className="inline" /> {review.rating}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {room.type || 'Property'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200 bg-white shadow-inner">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved. Designed with ❤️ in Nepal.
      </footer>
    </div>
  );
}
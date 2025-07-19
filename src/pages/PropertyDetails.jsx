import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaBed, FaBath, FaVectorSquare, FaMapMarkerAlt, FaTag, FaDollarSign,
  FaCalendarAlt, FaStar, FaInfoCircle, FaPhone, FaEnvelope, FaWifi,
  FaParking, FaSwimmingPool, FaDog, FaArrowLeft, FaArrowRight, FaCouch, FaWater,
  FaSpinner, FaPaperPlane, FaUserCircle, FaTimesCircle, FaCheckCircle, FaExclamationCircle,
  FaUserTie // Icon for owner
} from 'react-icons/fa';
import { MdFitnessCenter } from 'react-icons/md';
import logo from '/logo.png'; // Import your logo (adjust path if needed)

// Helper for star rating display
const StarRatingDisplay = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // States for property reviews
  const [propertyReviews, setPropertyReviews] = useState([]);
  const [propertyReviewLoading, setPropertyReviewLoading] = useState(true);
  const [propertyReviewError, setPropertyReviewError] = useState('');
  const [newPropertyRating, setNewPropertyRating] = useState(0);
  const [newPropertyComment, setNewPropertyComment] = useState('');
  const [submittingPropertyReview, setSubmittingPropertyReview] = useState(false);
  const [propertyReviewSubmissionSuccess, setPropertyReviewSubmissionSuccess] = useState('');

  // States for owner reviews
  const [ownerReviews, setOwnerReviews] = useState([]);
  const [ownerReviewLoading, setOwnerReviewLoading] = useState(true);
  const [ownerReviewError, setOwnerReviewError] = useState('');
  const [newOwnerRating, setNewOwnerRating] = useState(0);
  const [newOwnerComment, setNewOwnerComment] = useState('');
  const [submittingOwnerReview, setSubmittingOwnerReview] = useState(false);
  const [ownerReviewSubmissionSuccess, setOwnerReviewSubmissionSuccess] = useState('');

  // --- Booking State ---
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');
  // Placeholder for user's name (ideally fetched from token or user profile)
  const currentUserName = "Current User"; // Replace with actual user name

  // --- Fetch Property Details ---
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/owner/property/${id}`)
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.message || 'Failed to fetch property details.');
          });
        }
        return res.json();
      })
      .then(data => {
        const propertyData = data.property || data.data;
        if (propertyData) {
          setProperty(propertyData);
          setError('');
        } else {
          setError('Property not found or data is malformed.');
        }
      })
      .catch(err => {
        console.error("Property fetch error:", err);
        setError(err.message || 'Failed to load property details. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Fetch Property Reviews ---
  useEffect(() => {
    setPropertyReviewLoading(true);
    fetch(`${API_BASE_URL}/api/reviews/property/${id}`) // API endpoint for property reviews
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch property reviews.');
          } else {
            throw new Error('Failed to fetch property reviews: Server returned non-JSON response.');
          }
        }
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        } else {
          if (res.status === 204 || res.status === 200) {
            return { reviews: [] };
          }
          throw new Error('Failed to fetch property reviews: Server returned non-JSON response.');
        }
      })
      .then(data => {
        setPropertyReviews(data.reviews || data);
        setPropertyReviewError('');
      })
      .catch(err => {
        console.error("Property review fetch error:", err);
        setPropertyReviewError(err.message || 'Failed to load property reviews.');
      })
      .finally(() => setPropertyReviewLoading(false));
  }, [id]);

  // --- Fetch Owner Reviews ---
  useEffect(() => {
    if (!property?.owner?._id) return; // Only fetch if owner ID is available
    setOwnerReviewLoading(true);
    fetch(`${API_BASE_URL}/api/reviews/owner/${property.owner._id}`) // API endpoint for owner reviews
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch owner reviews.');
          } else {
            throw new Error('Failed to fetch owner reviews: Server returned non-JSON response.');
          }
        }
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        } else {
          if (res.status === 204 || res.status === 200) {
            return { reviews: [] };
          }
          throw new Error('Failed to fetch owner reviews: Server returned non-JSON response.');
        }
      })
      .then(data => {
        setOwnerReviews(data.reviews || data);
        setOwnerReviewError('');
      })
      .catch(err => {
        console.error("Owner review fetch error:", err);
        setOwnerReviewError(err.message || 'Failed to load owner reviews.');
      })
      .finally(() => setOwnerReviewLoading(false));
  }, [property?.owner?._id]); // Refetch owner reviews when owner ID changes

  // --- Handle Property Review Submission ---
  const handlePropertyReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPropertyReview(true);
    setPropertyReviewError('');
    setPropertyReviewSubmissionSuccess('');

    if (newPropertyRating === 0) {
      setPropertyReviewError("Please provide a star rating for the property.");
      setSubmittingPropertyReview(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found. Please log in.');

      const response = await fetch(`${API_BASE_URL}/api/reviews/property/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newPropertyRating, comment: newPropertyComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit property review.');
      }

      const submittedReview = await response.json();
      setPropertyReviews(prevReviews => [submittedReview, ...prevReviews]);
      setNewPropertyRating(0);
      setNewPropertyComment('');
      setPropertyReviewSubmissionSuccess('Property review submitted successfully!');
      setTimeout(() => setPropertyReviewSubmissionSuccess(''), 5000);
    } catch (err) {
      console.error("Submit property review error:", err);
      setPropertyReviewError(err.message || 'Could not submit property review.');
    } finally {
      setSubmittingPropertyReview(false);
    }
  };

  // --- Handle Owner Review Submission ---
  const handleOwnerReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOwnerReview(true);
    setOwnerReviewError('');
    setOwnerReviewSubmissionSuccess('');

    if (newOwnerRating === 0) {
      setOwnerReviewError("Please provide a star rating for the owner.");
      setSubmittingOwnerReview(false);
      return;
    }
    if (!property?.owner?._id) {
      setOwnerReviewError("Owner information not available to submit review.");
      setSubmittingOwnerReview(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found. Please log in.');

      const response = await fetch(`${API_BASE_URL}/api/reviews/owner/${property.owner._id}`, { // API endpoint for owner reviews
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newOwnerRating, comment: newOwnerComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit owner review.');
      }

      const submittedReview = await response.json();
      setOwnerReviews(prevReviews => [submittedReview, ...prevReviews]);
      setNewOwnerRating(0);
      setNewOwnerComment('');
      setOwnerReviewSubmissionSuccess('Owner review submitted successfully!');
      setTimeout(() => setOwnerReviewSubmissionSuccess(''), 5000);
    } catch (err) {
      console.error("Submit owner review error:", err);
      setOwnerReviewError(err.message || 'Could not submit owner review.');
    } finally {
      setSubmittingOwnerReview(false);
    }
  };


  // --- Handle Property Booking ---
  const handleBookProperty = async () => {
    setBookingSuccess('');
    setBookingError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to book this property.');
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: property._id })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to book property.');
      }
      setBookingSuccess('Property booked successfully!');
      setAlreadyBooked(true); // Update state to reflect booking
      setTimeout(() => setBookingSuccess(''), 5000);
    } catch (err) {
      setBookingError(err.message || 'Booking failed.');
    }
  };

  // Calculate average property rating
  const averagePropertyRating = propertyReviews.length > 0
    ? (propertyReviews.reduce((sum, review) => sum + review.rating, 0) / propertyReviews.length).toFixed(1)
    : 0;

  // Calculate average owner rating
  const averageOwnerRating = ownerReviews.length > 0
    ? (ownerReviews.reduce((sum, review) => sum + review.rating, 0) / ownerReviews.length).toFixed(1)
    : 0;

  // Handle carousel navigation
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % imageUrls.length
    );
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  // Helper function to render amenity icons (example, expand as needed)
  const renderAmenity = (amenityKey, IconComponent, label) => {
    if (property[amenityKey]) {
      return (
        <span className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {IconComponent && React.createElement(IconComponent, { className: "mr-2 text-blue-600" })}
          {label}
        </span>
      );
    }
    return null;
  };

  // --- Check if already booked by this user ---
  useEffect(() => {
    if (!isAuthenticated || !property?._id) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/bookings/user/me`, { // Assuming this endpoint returns user's bookings
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.bookings)) {
          setAlreadyBooked(data.bookings.some(b => b.propertyId?._id === property._id));
        }
      })
      .catch((err) => {
        console.error("Error checking existing bookings:", err);
        setAlreadyBooked(false); // Assume not booked on error
      });
  }, [isAuthenticated, property?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg font-semibold">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-6">
        <FaExclamationCircle className="text-5xl mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Property</h2>
        <p className="text-center">{error}</p>
        <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Go to Home
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-700 p-6">
        <FaInfoCircle className="text-5xl text-blue-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Property Not Found</h2>
        <p className="text-center">The property you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Go to Home
        </Link>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/800x600/E5E7EB?text=NivaasHub+No+Image';
  const imageUrls = property.images && property.images.length > 0
    ? property.images.map(img =>
        img.url ? img.url : `${API_BASE_URL}/uploads/${typeof img === 'string' ? img : ''}`
      )
    : [defaultImage];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Logo and Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg mr-4 focus:outline-none"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <img src={logo} alt="NivaasHub Logo" className="h-10 w-auto ml-auto" />
        <span className="ml-2 text-2xl font-bold text-blue-700 tracking-wide">NivaasHub</span>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        {/* Image Carousel Section */}
        <div className="relative h-96 bg-gray-200">
          <img
            src={imageUrls[currentImageIndex]}
            alt={property.title || 'Property Image'}
            className="w-full h-full object-cover"
          />
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
              >
                <FaArrowRight className="text-xl" />
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Property Details Section */}
        <div className="p-8 lg:p-12">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
            {property.title || 'Property Listing'}
          </h1>
          <p className="text-gray-600 text-lg flex items-center mb-6">
            <FaMapMarkerAlt className="text-blue-500 mr-2 flex-shrink-0" />
            {property.address || 'Address not available'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-800 text-xl font-bold bg-blue-50 p-4 rounded-xl shadow-sm">
              <FaDollarSign className="text-blue-600 mr-3 text-2xl" />
              <span className="truncate">NPR {property.price ? property.price.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-700 text-lg bg-green-50 p-4 rounded-xl shadow-sm">
              <FaBed className="text-green-600 mr-3 text-2xl" />
              <span className="truncate">{property.bedrooms || 'N/A'} Bedrooms</span>
            </div>
            <div className="flex items-center text-gray-700 text-lg bg-yellow-50 p-4 rounded-xl shadow-sm">
              <FaBath className="text-yellow-600 mr-3 text-2xl" />
              <span className="truncate">{property.bathrooms || 'N/A'} Bathrooms</span>
            </div>
            {property.area && (
              <div className="flex items-center text-gray-700 text-lg bg-red-50 p-4 rounded-xl shadow-sm">
                <FaVectorSquare className="text-red-600 mr-3 text-2xl" />
                <span className="truncate">{property.area} Sq. Ft.</span>
              </div>
            )}
            <div className="flex items-center text-gray-700 text-lg bg-purple-50 p-4 rounded-xl shadow-sm">
              <FaTag className="text-purple-600 mr-3 text-2xl" />
              <span className="truncate">{property.type || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-700 text-lg bg-indigo-50 p-4 rounded-xl shadow-sm">
              <FaCalendarAlt className="text-indigo-600 mr-3 text-2xl" />
              <span className="truncate">Posted: {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-blue-200 pb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description || 'No detailed description available for this property.'}
            </p>
          </div>

          {/* Amenities Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-blue-200 pb-2">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {renderAmenity('hasWifi', FaWifi, 'Wi-Fi')}
              {renderAmenity('hasParking', FaParking, 'Parking')}
              {renderAmenity('hasSwimmingPool', FaSwimmingPool, 'Swimming Pool')}
              {renderAmenity('hasGym', MdFitnessCenter, 'Gym')}
              {renderAmenity('isFurnished', FaCouch, 'Furnished')}
              {renderAmenity('hasWaterSupply', FaWater, 'Water Supply')}
              {renderAmenity('allowsPets', FaDog, 'Pets Allowed')}
              {!property.hasWifi && !property.hasParking && !property.hasSwimmingPool && !property.hasGym && !property.isFurnished && !property.hasWaterSupply && !property.allowsPets && (
                 <span className="text-gray-500 italic">No specific amenities listed.</span>
              )}
            </div>
          </div>

          {/* Contact Agent Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Interested? Contact Us!</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${property.ownerPhone || ''}`}
                className={`flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 flex-1 ${!property.ownerPhone ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!property.ownerPhone}
              >
                <FaPhone className="mr-2" /> Call Owner
              </a>
              <a
                href={`mailto:${property.ownerEmail || ''}?subject=Inquiry about Property ID ${property._id}`}
                className={`flex items-center justify-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 flex-1 ${!property.ownerEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!property.ownerEmail}
              >
                <FaEnvelope className="mr-2" /> Email Owner
              </a>
            </div>
            {(!property.ownerPhone && !property.ownerEmail) && (
                <p className="text-sm text-gray-500 mt-4 text-center">Contact information not available for this property.</p>
            )}
          </div>

          {/* Booking Section */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 p-6 bg-indigo-50 rounded-lg shadow-inner border border-indigo-200">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-indigo-200 pb-2">Property Booking</h3>
              <p className="text-gray-700 mb-4">
                Click the button below to book this property. You will be added to the property's booking list.
              </p>
            </div>
            <div className="flex flex-col items-center">
              {isAuthenticated ? (
                alreadyBooked ? (
                  <button
                    className="bg-gray-400 text-white font-bold py-3 px-8 rounded-lg shadow-md cursor-not-allowed opacity-70 flex items-center gap-2"
                    disabled
                  >
                    <FaCheckCircle /> Booked
                  </button>
                ) : (
                  <button
                    onClick={handleBookProperty}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <FaPaperPlane /> Add to Booked Property
                  </button>
                )
              ) : (
                <Link to="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 flex items-center gap-2">
                  <FaInfoCircle /> Login to Book
                </Link>
              )}
              {bookingSuccess && <div className="text-green-600 font-semibold mt-2 flex items-center gap-1"><FaCheckCircle /> {bookingSuccess}</div>}
              {bookingError && <div className="text-red-600 font-semibold mt-2 flex items-center gap-1"><FaTimesCircle /> {bookingError}</div>}
            </div>
          </div>

          {/* Property Reviews Section */}
          <div className="mt-8 pt-8 border-t-2 border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              Property Reviews ({propertyReviews.length})
              <span className="flex items-center text-lg text-gray-700 gap-1">
                <FaStar className="text-yellow-400" /> {averagePropertyRating} / 5
              </span>
            </h3>

            {/* Add Property Review Form */}
            {isAuthenticated ? (
              <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Leave a Property Review</h4>
                {propertyReviewSubmissionSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
                    <FaCheckCircle className="flex-shrink-0" /> <span className="block sm:inline">{propertyReviewSubmissionSuccess}</span>
                  </div>
                )}
                {propertyReviewError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
                    <FaTimesCircle className="flex-shrink-0" /> <span className="block sm:inline">{propertyReviewError}</span>
                  </div>
                )}
                <form onSubmit={handlePropertyReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating:</label>
                    <div className="flex text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= newPropertyRating ? 'text-yellow-400' : 'text-gray-300'}
                          onClick={() => setNewPropertyRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="propertyReviewComment" className="block text-gray-700 text-sm font-bold mb-2">Your Comment:</label>
                    <textarea
                      id="propertyReviewComment"
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-y"
                      rows="4"
                      placeholder="Share your experience with this property..."
                      value={newPropertyComment}
                      onChange={(e) => setNewPropertyComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingPropertyReview}
                    className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingPropertyReview ? (
                      <> <FaSpinner className="animate-spin mr-2" /> Submitting... </>
                    ) : (
                      <> <FaPaperPlane className="mr-2" /> Submit Property Review </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-center mb-8">
                <p>Please <Link to="/login" className="text-yellow-700 font-semibold hover:underline">log in</Link> to leave a property review.</p>
              </div>
            )}

            {/* Display Property Reviews */}
            {propertyReviewLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-3xl text-gray-400 mr-2" />
                <p className="text-gray-600">Loading property reviews...</p>
              </div>
            ) : propertyReviewError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                <p>{propertyReviewError}</p>
              </div>
            ) : propertyReviews.length === 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-center">
                No property reviews yet. Be the first to share your experience!
              </div>
            ) : (
              <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
                {propertyReviews.map((review, index) => (
                  <div key={review._id || index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
                    <div className="flex items-center mb-3">
                      <FaUserCircle className="text-gray-500 text-3xl mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">{review.reviewerName || 'Anonymous User'}</p>
                        <div className="text-sm text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <StarRatingDisplay rating={review.rating} />
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Owner Reviews Section */}
          <div className="mt-8 pt-8 border-t-2 border-purple-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
              Owner Reviews ({ownerReviews.length})
              <span className="flex items-center text-lg text-gray-700 gap-1">
                <FaStar className="text-yellow-400" /> {averageOwnerRating} / 5
              </span>
            </h3>

            {/* Add Owner Review Form */}
            {isAuthenticated && property?.owner?._id ? ( // Only show if authenticated and owner ID is available
              <div className="bg-purple-50 p-6 rounded-lg shadow-inner mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Leave a Review for {property.owner.name || 'the Owner'}</h4>
                {ownerReviewSubmissionSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
                    <FaCheckCircle className="flex-shrink-0" /> <span className="block sm:inline">{ownerReviewSubmissionSuccess}</span>
                  </div>
                )}
                {ownerReviewError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2">
                    <FaTimesCircle className="flex-shrink-0" /> <span className="block sm:inline">{ownerReviewError}</span>
                  </div>
                )}
                <form onSubmit={handleOwnerReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating:</label>
                    <div className="flex text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= newOwnerRating ? 'text-yellow-400' : 'text-gray-300'}
                          onClick={() => setNewOwnerRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ownerReviewComment" className="block text-gray-700 text-sm font-bold mb-2">Your Comment:</label>
                    <textarea
                      id="ownerReviewComment"
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-y"
                      rows="4"
                      placeholder={`Share your experience with ${property.owner.name || 'the owner'}...`}
                      value={newOwnerComment}
                      onChange={(e) => setNewOwnerComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingOwnerReview}
                    className="flex items-center justify-center bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingOwnerReview ? (
                      <> <FaSpinner className="animate-spin mr-2" /> Submitting... </>
                    ) : (
                      <> <FaPaperPlane className="mr-2" /> Submit Owner Review </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-center mb-8">
                <p>Please <Link to="/login" className="text-yellow-700 font-semibold hover:underline">log in</Link> to leave a review for the owner.</p>
              </div>
            )}

            {/* Display Owner Reviews */}
            {ownerReviewLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-3xl text-gray-400 mr-2" />
                <p className="text-gray-600">Loading owner reviews...</p>
              </div>
            ) : ownerReviewError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                <p>{ownerReviewError}</p>
              </div>
            ) : ownerReviews.length === 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg text-gray-600 text-center">
                No owner reviews yet. Be the first to share your experience with the owner!
              </div>
            ) : (
              <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
                {ownerReviews.map((review, index) => (
                  <div key={review._id || index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 animate-fade-in">
                    <div className="flex items-center mb-3">
                      <FaUserCircle className="text-gray-500 text-3xl mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">{review.reviewerName || 'Anonymous User'}</p>
                        <div className="text-sm text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <StarRatingDisplay rating={review.rating} />
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

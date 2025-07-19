import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMembershipStatus } from "../apiMember"; // Assuming this is your API utility
import {
  FaSpinner, FaUserCircle, FaStar, FaBuilding, FaUserTie, FaClipboardList,
  FaCrown, FaExclamationCircle, FaInfoCircle, FaArrowLeft, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa'; // Added FaCheckCircle, FaTimesCircle

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [membership, setMembership] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  // States for reviews given by the user
  const [givenPropertyReviews, setGivenPropertyReviews] = useState([]);
  const [givenOwnerReviews, setGivenOwnerReviews] = useState([]);
  const [givenReviewsLoading, setGivenReviewsLoading] = useState(true);
  const [givenReviewsError, setGivenReviewsError] = useState('');

  // States for reviews received by the user (if they are an owner)
  const [receivedPropertyReviews, setReceivedPropertyReviews] = useState([]);
  const [receivedOwnerReviews, setReceivedOwnerReviews] = useState([]);
  const [receivedReviewsLoading, setReceivedReviewsLoading] = useState(true);
  const [receivedReviewsError, setReceivedReviewsError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // --- Fetch User Info, Membership, and Bookings ---
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userRes.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!userRes.ok) throw new Error('Failed to fetch user');

        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch membership status
        if (userData.user && userData.user.email) {
          getMembershipStatus(userData.user.email)
            .then(res => setMembership(res.data))
            .catch(() => setMembership({ member: false }));
        }

        // Fetch bookings for this user
        if (userData.user && userData.user._id) {
          fetch(`${API_BASE_URL}/api/bookings/user/${userData.user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(async res => {
              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to load your bookings. Please try again.');
              }
              return res.json();
            })
            .then(data => setBookings(Array.isArray(data.bookings) ? data.bookings : []))
            .catch((err) => {
              setBookings([]);
              setGivenReviewsError(err.message || 'Failed to load your bookings. Please try again.');
            });
        }

        // --- Fetch Reviews Given by User ---
        setGivenReviewsLoading(true);
        try {
          const propertyReviewsRes = await fetch(`${API_BASE_URL}/api/reviews/user/${userData.user._id}/property-reviews`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const propertyReviewsData = await propertyReviewsRes.json();
          setGivenPropertyReviews(Array.isArray(propertyReviewsData.reviews) ? propertyReviewsData.reviews : []);

          const ownerReviewsRes = await fetch(`${API_BASE_URL}/api/reviews/user/${userData.user._id}/owner-reviews`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const ownerReviewsData = await ownerReviewsRes.json();
          setGivenOwnerReviews(Array.isArray(ownerReviewsData.reviews) ? ownerReviewsData.reviews : []);
        } catch (reviewErr) {
          console.error("Failed to fetch given reviews:", reviewErr);
          setGivenReviewsError("Failed to load your reviews.");
        } finally {
          setGivenReviewsLoading(false);
        }

        // --- Fetch Reviews Received by User (if owner) ---
        if (userData.user.isOwner && userData.user._id) { // Assuming `isOwner` flag and `_id` as ownerId
          setReceivedReviewsLoading(true);
          try {
            const receivedPropertyReviewsRes = await fetch(`${API_BASE_URL}/api/reviews/owner/${userData.user._id}/property-reviews-received`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const receivedPropertyReviewsData = await receivedPropertyReviewsRes.json();
            setReceivedPropertyReviews(Array.isArray(receivedPropertyReviewsData.reviews) ? receivedPropertyReviewsData.reviews : []);

            const receivedOwnerReviewsRes = await fetch(`${API_BASE_URL}/api/reviews/owner/${userData.user._id}/behavior-reviews-received`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const receivedOwnerReviewsData = await receivedOwnerReviewsRes.json();
            setReceivedOwnerReviews(Array.isArray(receivedOwnerReviewsData.reviews) ? receivedOwnerReviewsData.reviews : []);
          } catch (receivedReviewErr) {
            console.error("Failed to fetch received reviews:", receivedReviewErr);
            setReceivedReviewsError("Failed to load reviews for your properties/behavior.");
          } finally {
            setReceivedReviewsLoading(false);
          }
        }

      } catch (err) {
        console.error("Error fetching profile data:", err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      {/* Back Button Top Left */}
      <button
        className="absolute top-6 left-8 z-50 bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 text-blue-700 font-semibold hover:bg-blue-50 transition duration-200 flex items-center gap-2"
        onClick={() => navigate(-1)}
        style={{ position: 'fixed' }}
        aria-label="Back"
      >
        <FaArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            Welcome, <span className="text-blue-600">{user.name.split(' ')[0]}!</span>
          </h1>
          <p className="text-lg text-gray-600">Your personalized dashboard at NivaasHub.</p>
        </div>

        {/* User Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaUserCircle className="w-6 h-6 mr-2 text-blue-500" />
              My Details
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center text-lg">
                <span className="font-semibold w-24">Name:</span>
                <span className="flex-1">{user.name}</span>
              </div>
              <div className="flex items-center text-lg">
                <span className="font-semibold w-24">Email:</span>
                <span className="flex-1">{user.email}</span>
              </div>
              {/* Add more user details if available, e.g., phone, address */}
            </div>
          </div>

          {/* Membership Status */}
          <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-2xl shadow-md p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaCrown className="w-6 h-6 mr-2 text-green-500" />
              Membership
            </h3>
            <div className="text-gray-700 text-lg">
              {membership && membership.member ? (
                <p className="flex items-center text-green-700 font-semibold">
                  <FaCheckCircle className="w-5 h-5 mr-1" />
                  Active Member ({membership.membershipPlan})
                </p>
              ) : (
                <p className="flex flex-col sm:flex-row sm:items-center text-red-600 font-medium">
                  <FaTimesCircle className="w-5 h-5 mr-1 mb-1 sm:mb-0" />
                  No Membership. <button onClick={() => navigate('/membership-plans')} className="text-blue-600 hover:underline ml-0 sm:ml-1 mt-1 sm:mt-0">Explore plans</button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* My Booked Properties Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaClipboardList className="w-6 h-6 mr-2 text-indigo-500" />
            My Booked Properties
          </h3>
          {bookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-600 italic">
              <p className="mb-2">It looks like you haven't booked any properties yet.</p>
              <button onClick={() => navigate('/rooms')} className="text-blue-600 hover:underline font-medium">
                Start exploring properties now!
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto custom-scrollbar">
              {bookings.map((b, i) => (
                <li key={b._id || i} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      Property: <span className="text-blue-700">{b.propertyId?.title || b.propertyId?.name || b.propertyId?.address || 'N/A'}</span>
                    </p>
                    {b.bookedAt && <p className="text-sm text-gray-500 mt-1">Booking Date: {new Date(b.bookedAt).toLocaleDateString()}</p>}
                  </div>
                  <button
                    onClick={() => navigate(`/property/${b.propertyId?._id}`)}
                    className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-sm text-sm"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* My Reviews (Given) Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaStar className="w-6 h-6 mr-2 text-yellow-500" />
            My Reviews (Given)
          </h3>
          {givenReviewsLoading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Loading your reviews...</span>
            </div>
          ) : givenReviewsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
              <p>{givenReviewsError}</p>
            </div>
          ) : (
            <>
              {/* Property Reviews Given */}
              <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Property Reviews</h4>
              {givenPropertyReviews.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-600 italic mb-6">
                  You haven't reviewed any properties yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto custom-scrollbar mb-6">
                  {givenPropertyReviews.map((review) => (
                    <li key={review._id} className="py-4">
                      <p className="text-lg font-semibold text-gray-800 mb-1">
                        Property: <Link to={`/property/${review.propertyId?._id}`} className="text-blue-700 hover:underline">{review.propertyId?.title || review.propertyId?.address || 'N/A'}</Link>
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <StarRatingDisplay rating={review.rating} />
                        <span className="ml-2">({review.rating}/5)</span>
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                      <p className="text-xs text-gray-500 mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Owner Reviews Given */}
              <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Owner Reviews</h4>
              {givenOwnerReviews.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-600 italic">
                  You haven't reviewed any owners yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto custom-scrollbar">
                  {givenOwnerReviews.map((review) => (
                    <li key={review._id} className="py-4">
                      <p className="text-lg font-semibold text-gray-800 mb-1">
                        Owner: <span className="text-purple-700">{review.ownerId?.name || 'N/A Owner'}</span>
                      </p>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-x-4">
                        <span className="flex items-center gap-1">Overall: <StarRatingDisplay rating={review.overallRating || 0} /> ({review.overallRating}/5)</span>
                        {review.behaviorRating !== undefined && (
                          <span className="flex items-center gap-1">Behavior: <StarRatingDisplay rating={review.behaviorRating || 0} /> ({review.behaviorRating}/5)</span>
                        )}
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                      <p className="text-xs text-gray-500 mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Reviews Received (As Owner) Section - Conditional */}
        {user.isOwner && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUserTie className="w-6 h-6 mr-2 text-green-500" />
              Reviews Received (As Owner)
            </h3>
            {receivedReviewsLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">Loading received reviews...</span>
              </div>
            ) : receivedReviewsError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                <p>{receivedReviewsError}</p>
              </div>
            ) : (
              <>
                {/* Property Reviews Received */}
                <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Reviews on Your Properties</h4>
                {receivedPropertyReviews.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-600 italic mb-6">
                    No reviews yet for your properties.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto custom-scrollbar mb-6">
                    {receivedPropertyReviews.map((review) => (
                      <li key={review._id} className="py-4">
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          Property: <Link to={`/property/${review.propertyId?._id}`} className="text-blue-700 hover:underline">{review.propertyId?.title || review.propertyId?.address || 'N/A'}</Link>
                        </p>
                        <p className="text-sm text-gray-600 mb-1">Reviewer: {review.reviewerName || 'Anonymous'}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <StarRatingDisplay rating={review.rating} />
                          <span className="ml-2">({review.rating}/5)</span>
                        </div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Owner Behavior Reviews Received */}
                <h4 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Reviews on Your Behavior</h4>
                {receivedOwnerReviews.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-600 italic">
                    No reviews yet on your behavior as an owner.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto custom-scrollbar">
                    {receivedOwnerReviews.map((review) => (
                      <li key={review._id} className="py-4">
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                          Reviewer: {review.reviewerName || 'Anonymous'}
                        </p>
                        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-2 gap-x-4">
                          <span className="flex items-center gap-1">Overall: <StarRatingDisplay rating={review.overallRating || 0} /> ({review.overallRating}/5)</span>
                          {review.behaviorRating !== undefined && (
                            <span className="flex items-center gap-1">Behavior: <StarRatingDisplay rating={review.behaviorRating || 0} /> ({review.behaviorRating}/5)</span>
                          )}
                        </div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

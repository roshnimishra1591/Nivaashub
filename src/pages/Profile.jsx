import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembershipStatus } from "../apiMember";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [membership, setMembership] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user info
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.user);
        // Fetch membership status after user is set
        if (data.user && data.user.email) {
          getMembershipStatus(data.user.email)
            .then(res => setMembership(res.data))
            .catch(() => setMembership({ member: false }));
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });

    // Try multiple endpoints for bookings, stop at first success
    const tryEndpoints = async () => {
      // **Important:** You need to add your actual booking API endpoints here.
      // For demonstration, I'm adding a dummy endpoint. Replace with your backend URL.
      const endpoints = [
        'http://localhost:5000/api/bookings/my', // Example: primary booking endpoint
        // 'http://localhost:5000/api/user/bookings', // Example: alternative endpoint
      ];
      let found = false;
      for (let url of endpoints) {
        try {
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setBookings(data);
            } else if (Array.isArray(data.bookings)) {
              setBookings(data.bookings);
            } else {
              setBookings([]);
            }
            found = true;
            break;
          }
        } catch (e) {
          // Log error for debugging, but don't stop the loop
          console.error(`Failed to fetch from ${url}:`, e);
        }
      }
      if (!found) setBookings([]);
    };
    tryEndpoints();
  }, [navigate]); // Added navigate to dependency array

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      {/* Back Button Top Right */}
      <button
        className="absolute top-6 left-8 z-50 bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 text-blue-700 font-semibold hover:bg-blue-50 transition duration-200 flex items-center gap-2"
        onClick={() => navigate(-1)}
        style={{ position: 'fixed' }}
        aria-label="Back"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
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

          {/* Membership Status (Now shows real status) */}
          <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-2xl shadow-md p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path></svg>
              Membership
            </h3>
            <div className="text-gray-700 text-lg">
              {membership && membership.member ? (
                <p className="flex items-center text-green-700 font-semibold">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Active Member ({membership.membershipPlan})
                </p>
              ) : (
                <p className="flex flex-col sm:flex-row sm:items-center text-red-600 font-medium">
                  <svg className="w-5 h-5 mr-1 mb-1 sm:mb-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                  No Membership. <button onClick={() => navigate('/membership-plans')} className="text-blue-600 hover:underline ml-0 sm:ml-1 mt-1 sm:mt-0">Explore plans</button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* My Booked Properties Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 transform transition duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
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
            <ul className="divide-y divide-gray-200">
              {bookings.map((b, i) => (
                <li key={i} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      Property: <span className="text-blue-700">{b.propertyName || b.address || 'N/A'}</span>
                    </p>
                    {b.date && <p className="text-sm text-gray-500 mt-1">Booking Date: {b.date}</p>}
                    {/* Add more booking details if available, e.g., status, booking ID, property type */}
                  </div>
                  <button
                    onClick={() => { /* Implement view details functionality */ }}
                    className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-sm text-sm"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useRef, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import NavBar from '../components/NavBar';
import contactBg from '../assets/contactbg.jpg';
import contactMap from '../assets/contact map image.png';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaHeadset, FaQuestionCircle, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Added FaSpinner, FaCheckCircle, FaTimesCircle
import axios from 'axios';

export default function ContactUsPage() {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      if (nameRef.current) nameRef.current.value = user.name || '';
      if (emailRef.current) emailRef.current.value = user.email || '';
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setSuccessMessage(''); // Clear previous messages
    setErrorMessage('');

    try {
      // Assuming 'subject' is needed by the backend, you might want to add an input for it
      // For now, let's add a default subject if your backend expects it.
      // If your backend doesn't need a subject, you can remove this.
      const payload = {
        sender: nameRef.current.value,
        email: emailRef.current.value,
        content: messageRef.current.value,
        subject: "General Inquiry from Contact Us Page" // Default subject
      };

      await axios.post('http://localhost:5000/api/admin/messages', payload); // Ensure this endpoint is correct for public contact
      setSuccessMessage('Your message has been sent successfully! We will get back to you soon.');
      // Clear form fields
      nameRef.current.value = '';
      emailRef.current.value = '';
      messageRef.current.value = '';
    } catch (err) {
      console.error("Failed to send message:", err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false); // End loading
      // Clear messages after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 text-gray-900 font-sans antialiased">
      {/* Header Section (Hero) */}
      <header
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center flex flex-col justify-center items-center shadow-xl overflow-hidden"
        style={{ backgroundImage: `url(${contactBg})` }}
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
            Reach Out to NivaasHub
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mt-4 max-w-3xl mx-auto text-blue-100 drop-shadow-lg">
            We're here to help you find your perfect room or assist with any inquiries.
          </p>
        </div>
      </header>

      {/* --- Main Content Area: Contact Form & Map --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Contact Form Section */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 lg:p-10 animate-slide-in-left">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-6 flex items-center gap-3">
            <FaPaperPlane className="text-blue-600" /> Send Us a Message
          </h2>
          <p className="mb-8 text-gray-700 leading-relaxed">
            Have a question, feedback, or need assistance? Fill out the form below, and we'll get back to you as soon as possible.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 animate-fade-in">
                <FaTimesCircle className="text-red-500 text-xl" />
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                placeholder="John Doe"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200 text-gray-800"
                required
                defaultValue={user ? user.name : ''}
                readOnly={!!user}
                style={user ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                placeholder="john.doe@example.com"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200 text-gray-800"
                required
                defaultValue={user ? user.email : ''}
                readOnly={!!user}
                style={user ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Your Message</label>
              <textarea
                id="message"
                ref={messageRef}
                placeholder="Tell us how we can help..."
                rows="7"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 transition duration-200 text-gray-800"
                required // Added required attribute
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="w-full bg-blue-600 text-white font-bold px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send Message <FaPaperPlane />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="w-full md:w-1/2 h-80 sm:h-96 md:h-[600px] bg-gray-200 rounded-xl shadow-lg overflow-hidden animate-slide-in-right">
          <img
            src={contactMap}
            alt="NivaasHub Location Map"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </main>

      {/* --- Contact Info Section --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 bg-white rounded-xl shadow-lg mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 animate-fade-in-up">
        {/* Main Office Contact */}
        <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-sm">
          <div className="text-blue-600 text-4xl mb-4 bg-blue-100 p-4 rounded-full shadow-md">
            <FaMapMarkerAlt />
          </div>
          <h3 className="text-xl font-bold text-blue-800 mb-2">Main Office</h3>
          <p className="text-gray-700">Balkumari,Lalitpur Nepal</p>
          <p className="text-gray-700 mt-2 font-semibold">Open Hours:</p>
          <p className="text-gray-600 flex items-center gap-2"><FaClock className="text-blue-500" /> Mon - Fri: 9:00 AM - 6:00 PM</p>
        </div>

        {/* Feedback Contact */}
        <div className="flex flex-col items-center text-center p-6 bg-yellow-50 rounded-lg shadow-sm">
          <div className="text-yellow-600 text-4xl mb-4 bg-yellow-100 p-4 rounded-full shadow-md">
            <FaHeadset className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">For Feedback</h3>
          <p className="text-gray-700">
            <a href="tel:+9779816746292" className="text-blue-700 hover:underline flex items-center gap-2">
              <FaPhone className="text-blue-500" /> +977 9816746292
            </a>
          </p>
          <p className="text-gray-700 mt-2">
            <a href="mailto:roshnimishra1591@gmail.com" className="text-blue-700 hover:underline flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> roshnimishra1591@gmail.com
            </a>
          </p>
          <p className="text-gray-700 mt-2 font-semibold">Available:</p>
          <p className="text-gray-600 flex items-center gap-2"><FaClock className="text-blue-500" /> Mon - Fri: 9:00 AM - 6:00 PM</p>
        </div>

        {/* Query Contact */}
        <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-lg shadow-sm">
          <div className="text-green-600 text-4xl mb-4 bg-green-100 p-4 rounded-full shadow-md">
            <FaQuestionCircle className="text-green-600" /> {/* Changed to FaQuestionCircle */}
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">For Queries</h3>
          <p className="text-gray-700">
            <a href="tel:+9779845014997" className="text-blue-700 hover:underline flex items-center gap-2">
              <FaPhone className="text-blue-500" /> +977 9845014997
            </a>
          </p>
          <p className="text-gray-700 mt-2">
            <a href="mailto:pallavipandey731@gmail.com" className="text-blue-700 hover:underline flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> pallavipandey731@gmail.com
            </a>
          </p>
          <p className="text-gray-700 mt-2 font-semibold">Available:</p>
          <p className="text-gray-600 flex items-center gap-2"><FaClock className="text-blue-500" /> Mon - Sat: 10:00 AM - 5:00 PM</p>
        </div>
      </section>

      {/* --- Final CTA / Closing Message Section --- */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-16 lg:py-20 px-4 sm:px-6 shadow-inner">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          We're Always Here to Help!
        </h2>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Your feedback and queries are invaluable to us. We're dedicated to providing exceptional support and making your NivaasHub experience seamless.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
          <button
            onClick={() => window.location.href = 'mailto:nivaashub@outlook.com'} // Direct email link
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-blue-900 rounded-full font-bold text-lg shadow-lg
                       hover:bg-yellow-300 hover:scale-105 transition duration-300 ease-in-out transform"
          >
            Email Us Directly <FaEnvelope className="ml-2" />
          </button>
          <button
            onClick={() => window.location.href = 'tel:+9779816746292'} // Use a generic phone number or your main one
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg shadow-lg
                       hover:bg-white hover:text-blue-800 hover:scale-105 transition duration-300 ease-in-out transform"
          >
            Call Us <FaPhone className="ml-2" />
          </button>
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
      </footer>
    </div>
  );
}

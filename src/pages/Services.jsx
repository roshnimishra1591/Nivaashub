import React from 'react';
import NavBar from '../components/NavBar';
import serviceBg from '../assets/buildings.jpg'; // Ensure this path is correct
import { Link } from 'react-router-dom';
import { FaHome, FaListAlt, FaVrCardboard, FaHeadset, FaCreditCard, FaTools, FaFileContract, FaBoxOpen, FaMapMarkerAlt, FaUserCheck, FaChartBar, FaUsers } from 'react-icons/fa'; // Importing react-icons

const services = [
  {
    title: 'Room Rentals',
    icon: <FaHome className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Affordable, verified rooms for students, professionals, and families. Browse listings, view details, and book easily.'
  },
  {
    title: 'Property Listing',
    icon: <FaListAlt className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'List your property with us and reach thousands of potential tenants. Hassle-free onboarding and support.'
  },
  {
    title: 'Virtual Tours',
    icon: <FaVrCardboard className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Experience properties remotely with immersive virtual tours and detailed photo galleries.'
  },
  {
    title: 'Customer Support',
    icon: <FaHeadset className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Friendly, responsive support for all your rental needs. We help with queries, issues, and feedback.'
  },
  {
    title: 'Secure Payments',
    icon: <FaCreditCard className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Safe, transparent payment options for tenants and property owners. Your transactions are protected.'
  },
  {
    title: 'Maintenance & Cleaning',
    icon: <FaTools className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Regular property maintenance and professional cleaning services to ensure a comfortable stay.'
  },
  {
    title: 'Rental Agreements',
    icon: <FaFileContract className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Easy, transparent digital rental agreements for peace of mind and legal security.'
  },
  {
    title: 'Move-in Assistance',
    icon: <FaBoxOpen className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Support with moving, settling in, and connecting utilities for a hassle-free start.'
  },
  {
    title: 'Local Area Guidance',
    icon: <FaMapMarkerAlt className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Get tips on local amenities, transport, and community resources to help you feel at home.'
  },
  {
    title: 'Tenant Verification',
    icon: <FaUserCheck className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Background checks and verification for safe, trustworthy tenancies.'
  },
  {
    title: 'Owner Dashboard',
    icon: <FaChartBar className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'A dedicated dashboard for property owners to manage listings, view bookings, and track payments.'
  },
  {
    title: 'Community Events',
    icon: <FaUsers className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />,
    desc: 'Stay connected with local events, meetups, and activities for tenants and owners.'
  },
];

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section with Hero Background */}
      <header
        className="relative h-[45vh] md:h-[55vh] bg-cover bg-center flex items-center justify-center shadow-xl"
        style={{ backgroundImage: `url(${serviceBg})` }}
      >
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-blue-700/50" />

        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center animate-fade-in-up">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-10 drop-shadow-2xl leading-tight">
            Our Comprehensive Services
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mt-4 max-w-3xl drop-shadow-lg">
            Discover the range of services we offer to make your rental experience smooth, secure, and satisfying. Your comfort is our priority!
          </p>
        </div>
      </header>

      {/* Main Content Area - Services Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-12 animate-fade-in-up delay-300">
          How We Help You Thrive
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center
                         transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-blue-600 group
                         animate-fade-in-up"
              style={{ animationDelay: `${0.4 + idx * 0.1}s` }} // Staggered animation
            >
              <div className="mb-6 bg-blue-100 group-hover:bg-white rounded-full p-4 transition-colors duration-300 shadow-inner">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-900 group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 text-base leading-relaxed line-clamp-3">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Call to Action / Footer CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-10 px-4 sm:px-6 text-xl font-medium mt-12 shadow-inner">
        <p className="max-w-3xl mx-auto leading-relaxed mb-4">
          Can't find a specific service? We're always here to listen and adapt.
        </p>
        <Link to={"/contact"} className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-full font-bold shadow-lg
                                        hover:bg-gray-100 hover:scale-105 transition duration-300 ease-in-out">
          Reach Out To Us <span className="ml-2 text-2xl animate-pulse">→</span>
        </Link>
      </div>
    </div>
  );
}
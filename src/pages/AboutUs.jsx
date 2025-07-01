import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Ensure this path is correct

// Import images
import roshniImg from '../assets/admin-roshni.jpg';
import pallaviImg from '../assets/admin-pallavi.jpg';
// Make sure you have an image for Amentika too, or it will be an empty circle
// import amentikaImg from '../assets/admin-amentika.jpg'; // Assuming you'll add this
import aboutSectionImg from '../assets/buildings.jpg'; // This seems to be used for the "What We Do" section
import headerBg from '../assets/image.jpg'; // Hero background
import gallery1 from '../assets/gallery1.jpeg';
import gallery2 from '../assets/gallery2.jpg';
import gallery3 from '../assets/gallery3.jpg';
import mapImg from '../assets/map.png';

// Importing icons from react-icons
import { FaGithub, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaQuoteLeft, FaHandshake, FaLightbulb, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Roshni Mishra',
    title: 'Admin & Marketing Specialist',
    image: roshniImg,
    github: 'https://github.com/roshnimishra',
    instagram: 'https://instagram.com/roshnimishra6078',
    facebook: '#', // Example social link
    linkedin: '#', // Example social link
  },
  {
    name: 'Pallavi Panday',
    title: 'Admin & Customer Support Lead',
    image: pallaviImg,
    github: 'https://github.com/pallavipandey',
    instagram: 'https://instagram.com/aliyanapanday',
    twitter: '#', // Example social link
    linkedin: '#', // Example social link
  },
  {
    name: 'Amentika Shakiya',
    title: 'Admin & Operations Manager',
    // image: amentikaImg, // Uncomment once you have the image
    github: 'https://github.com/amentikashakiya',
    instagram: 'https://instagram.com/amentikashakiya',
    facebook: '#', // Example social link
    twitter: '#', // Example social link
  },
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Header Section (Hero) */}
      <header
        className="relative h-[60vh] lg:h-[70vh] bg-cover bg-center flex flex-col justify-center items-center shadow-xl overflow-hidden"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-blue-700/50" />

        {/* Navigation Bar - Using your NavBar component */}
        <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <NavBar />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-white text-center px-6 pt-20 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-4 drop-shadow-2xl leading-tight">
            Discover NivaasHub
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mt-4 max-w-3xl mx-auto text-blue-100 drop-shadow-lg">
            Your trusted partner for finding comfortable and affordable homes in Nepal.
          </p>
        </div>
      </header>

      {/* --- Section: What We Do --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 bg-white rounded-xl shadow-lg mt-[-5rem] relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16 lg:gap-20">
        <div className="w-full md:w-1/2 flex justify-center animate-slide-in-left">
          <img
            src={aboutSectionImg}
            alt="About NivaasHub"
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="w-full md:w-1/2 animate-fade-in-right">
          <p className="text-blue-600 font-semibold text-lg mb-3 flex items-center gap-2">
            <FaHandshake className="text-xl" /> Our Mission
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-blue-900 mb-6 leading-tight">
            Connecting You to Your Ideal Living Space
          </h2>
          <p className="mb-5 text-gray-700 text-lg leading-relaxed">
            At **NivaasHub**, we focus on providing **affordable and comfortable room rentals** for individuals, students, and working professionals across Nepal. Our platform connects tenants with **verified rental spaces**, ensuring transparency, safety, and reliability in every step of your housing journey.
          </p>
          <p className="mb-5 text-gray-700 text-lg leading-relaxed">
            We aim to **simplify the housing process** by offering a seamless experience from discovery to booking. Whether you're relocating, studying, or just looking for a new place, NivaasHub is here to help you find your next home with ease.
          </p>
          <p className="italic font-semibold text-blue-800 text-lg">
            &mdash; The NivaasHub Team
          </p>
        </div>
      </section>

      {/* --- Section: Our Values --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-blue-900 mb-12 animate-fade-in-up">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <FaQuoteLeft className="text-blue-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-blue-800 mb-3">Transparency</h3>
            <p className="text-gray-700 leading-relaxed">
              We ensure clear communication and genuine listings, building trust with every interaction. No hidden fees, no surprises.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <FaLightbulb className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-blue-800 mb-3">Innovation</h3>
            <p className="text-gray-700 leading-relaxed">
              Constantly evolving our platform and services to provide the most efficient and user-friendly experience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <FaHandshake className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-blue-800 mb-3">Community</h3>
            <p className="text-gray-700 leading-relaxed">
              Fostering a supportive network for tenants and owners, making NivaasHub more than just a rental platform.
            </p>
          </div>
        </div>
      </section>

      {/* --- Section: Our Team --- */}
      <section className="px-4 sm:px-6 py-16 lg:py-24 bg-blue-50">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-blue-900 mb-12 animate-fade-in-up">
          Meet Our Dedicated Team
        </h2>
        <p className="text-center mb-16 max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed animate-fade-in-up delay-200">
          We're a passionate group of professionals committed to revolutionizing your rental experience. Each team member brings unique skills and a shared vision to make NivaasHub the best platform for finding your next home.
        </p>
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-blue-600 group animate-fade-in-up"
              style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
            >
              <div className="w-40 h-40 mx-auto mb-6 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border-4 border-blue-200 group-hover:border-white transition-colors duration-300">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  // Placeholder if image is missing
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-blue-900 group-hover:text-white transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-md text-gray-600 group-hover:text-blue-100 transition-colors duration-300 mb-4">
                {member.title}
              </p>
              <div className="mt-2 flex justify-center gap-4">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="text-gray-700 group-hover:text-white hover:scale-125 transition-transform duration-200">
                    <FaGithub size={24} />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-gray-700 group-hover:text-white hover:scale-125 transition-transform duration-200">
                    <FaInstagram size={24} />
                  </a>
                )}
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="text-gray-700 group-hover:text-white hover:scale-125 transition-transform duration-200">
                    <FaFacebookF size={24} />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-gray-700 group-hover:text-white hover:scale-125 transition-transform duration-200">
                    <FaTwitter size={24} />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-700 group-hover:text-white hover:scale-125 transition-transform duration-200">
                    <FaLinkedinIn size={24} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section: Our Gallery --- */}
      <section className="px-4 sm:px-6 py-16 lg:py-24 bg-white">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-blue-900 mb-12 animate-fade-in-up">
          Glimpses of NivaasHub
        </h2>
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up">
            <img src={gallery1} alt="NivaasHub Gallery 1" className="w-full h-64 object-cover" />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-100">
            <img src={gallery2} alt="NivaasHub Gallery 2" className="w-full h-64 object-cover" />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-200">
            <img src={gallery3} alt="NivaasHub Gallery 3" className="w-full h-64 object-cover" />
          </div>
          {/* Add more gallery images here if needed for a richer display */}
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center py-16 lg:py-20 px-4 sm:px-6 shadow-inner">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          Ready to Find Your Perfect Room?
        </h2>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Join thousands of satisfied tenants and owners who've found their ideal match with NivaasHub. Start your journey today!
        </p>
        <Link
          to="/rooms" // Link to your rooms page
          className="inline-flex items-center px-8 py-4 bg-yellow-400 text-blue-900 rounded-full font-bold text-lg shadow-lg
                     hover:bg-yellow-300 hover:scale-105 transition duration-300 ease-in-out transform animate-bounce-subtle"
        >
          Explore Rooms Now <span className="ml-3">→</span>
        </Link>
      </section>

      {/* --- Footer Section --- */}
      <footer className="bg-gray-900 text-gray-200 px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About NivaasHub */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src="/logo.png" alt="NivaasHub Logo" className="h-10 w-10 object-contain rounded-full bg-white p-1" />
            <h2 className="text-2xl font-bold text-white">NivaasHub</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm">
            NivaasHub is your trusted room rental partner in Nepal. We offer safe, convenient, and affordable accommodations tailored to your lifestyle. Our mission is to make finding a home easy and stress-free, with a focus on transparency, support, and building a strong community.
          </p>
          <div className="flex mt-6 gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200"><FaFacebookF size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200"><FaLinkedinIn size={20} /></a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-5">Useful Links</h4>
          <ul className="space-y-3 text-gray-400 text-base">
            <li><Link to="/" className="hover:text-blue-400 transition-colors duration-200">Home</Link></li>
            <li><Link to="/rooms" className="hover:text-blue-400 transition-colors duration-200">Rooms</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors duration-200">Services</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors duration-200">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Gallery */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-5">Gallery</h4>
          <div className="grid grid-cols-3 gap-3">
            <img src={gallery1} alt="Gallery 1" className="w-full h-20 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300" />
            <img src={gallery2} alt="Gallery 2" className="w-full h-20 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300" />
            <img src={gallery3} alt="Gallery 3" className="w-full h-20 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300" />
            {/* Add more gallery images here as needed */}
          </div>
        </div>

        {/* Contact Info / Locations */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-5">Get in Touch</h4>
          <ul className="space-y-3 text-gray-400 text-base">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-400 text-xl mt-1 flex-shrink-0" />
              <span>Rajbiraj, Madhesh Province, Nepal</span>
            </li>
            <li className="flex items-start gap-3">
              <FaPhone className="text-blue-400 text-xl mt-1 flex-shrink-0" />
              <span>+977 98XXXXXXXX (Call/WhatsApp)</span>
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-blue-400 text-xl mt-1 flex-shrink-0" />
              <span>info@nivaashub.com</span>
            </li>
          </ul>
          {mapImg && (
             <div className="mt-8 w-full h-40 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img src={mapImg} alt="Our Location Map" className="w-full h-full object-cover" />
             </div>
          )}
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-gray-950 text-gray-500 text-center py-4 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved. Designed with ❤️ in Nepal.
      </div>
    </div>
  );
}
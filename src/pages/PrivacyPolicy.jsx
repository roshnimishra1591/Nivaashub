import React from 'react';
import NavBar from '../components/NavBar'; // Adjust the import based on your file structure
import privacyBg from '../assets/privacy.jpg'; // Placeholder image for the header background
import { FaShieldAlt, FaInfoCircle, FaLock, FaUserCheck, FaCookieBite, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa'; // Importing icons

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 text-gray-900 font-sans antialiased">
      {/* Header Section (Hero) */}
      <header
        className="relative h-[45vh] md:h-[55vh] bg-cover bg-center flex flex-col justify-center items-center shadow-xl overflow-hidden"
        style={{ backgroundImage: `url(${privacyBg || 'https://images.unsplash.com/photo-1544365768-466d3a985d68?auto=format&fit=crop&w=1200&q=80'})` }} // Placeholder image if privacyBg is not found
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
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mt-4 max-w-3xl mx-auto text-blue-100 drop-shadow-lg">
            Your trust is our priority. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </header>

      {/* Main Content Area - Privacy Policy Details */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12 space-y-8 animate-fade-in-up delay-200">

          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaInfoCircle className="text-blue-600" /> Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to NivaasHub. This Privacy Policy describes how NivaasHub ("we," "us," or "our") collects, uses, and shares your personal information when you use our website and services (collectively, the "Service"). We are committed to protecting your privacy and handling your data in an open and transparent manner.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By accessing or using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaUserCheck className="text-blue-600" /> Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We collect several types of information from and about users of our Service, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
              <li>**Personal Identifiable Information (PII):** Such as your name, email address, phone number, physical address, and payment information when you register, list a property, or make a booking.</li>
              <li>**Usage Data:** Information about how you access and use the Service, including your IP address, browser type, operating system, pages viewed, and the dates/times of your visits.</li>
              <li>**Location Data:** If you enable location services, we may collect precise or approximate location information from your mobile device.</li>
              <li>**Cookies and Tracking Technologies:** We use cookies and similar tracking technologies to track activity on our Service and hold certain information.</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaLock className="text-blue-600" /> How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
              <li>To provide and maintain our Service.</li>
              <li>To manage your account and registration.</li>
              <li>To process transactions and send related information (e.g., booking confirmations).</li>
              <li>To improve, personalize, and expand our Service.</li>
              <li>To communicate with you, including sending updates, security alerts, and support messages.</li>
              <li>To monitor the usage of our Service and detect, prevent, and address technical issues.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </div>

          {/* How We Share Your Information */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaShieldAlt className="text-blue-600" /> How We Share Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may share your personal information in the following situations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
              <li>**With Service Providers:** We may share your data with third-party vendors to perform services on our behalf (e.g., payment processing, hosting, analytics).</li>
              <li>**For Business Transfers:** In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
              <li>**With Affiliates:** We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
              <li>**With Your Consent:** We may disclose your personal information for any other purpose with your consent.</li>
              <li>**Legal Requirements:** When required by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaLock className="text-blue-600" /> Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The security of your data is important to us. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </div>

          {/* Your Choices and Rights */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaUserCheck className="text-blue-600" /> Your Choices and Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
              <li>**Access and Update:** You can access and update your personal information through your account settings.</li>
              <li>**Opt-Out:** You can opt-out of receiving promotional communications from us by following the unsubscribe link in those emails.</li>
              <li>**Cookies:** You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
            </ul>
          </div>

          {/* Third-Party Links */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaExclamationTriangle className="text-blue-600" /> Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </div>

          {/* Children's Privacy */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaCookieBite className="text-blue-600" /> Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for use by children under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children have provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </div>

          {/* Changes to This Privacy Policy */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaInfoCircle className="text-blue-600" /> Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-4 flex items-center gap-3">
              <FaEnvelope className="text-blue-600" /> Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
              <li>By email: <a href="mailto:info@nivaashub.com" className="text-blue-700 hover:underline">info@nivaashub.com</a></li>
              <li>By visiting this page on our website: <a href="/contact" className="text-blue-700 hover:underline">NivaasHub Contact</a></li>
            </ul>
          </div>

          <p className="text-gray-500 text-sm italic text-right mt-10">Last updated: June 30, 2025</p>
        </div>
      </main>

      {/* Footer Section (Consistent with other pages) */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} NivaasHub. All rights reserved.
      </footer>
    </div>
  );
}
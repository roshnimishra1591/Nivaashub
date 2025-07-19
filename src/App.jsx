import React, { useEffect, useState, createContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import AboutUs from './pages/AboutUs'
import Rooms from './pages/Rooms'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OwnerLogin from "./pages/OwnerLogin";
import OwnerSignup from "./pages/OwnerSignup";
import AdminLogin from "./pages/AdminLogin";
import Payment from "./pages/Payment";
import SlideTransition from './components/SlideTransition'
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerAddProperty from "./pages/OwnerAddProperty";
import OwnerMyProperties from "./pages/OwnerMyProperties";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerProfile from "./pages/OwnerProfile";
import MembershipPlans from "./pages/MembershipPlans";
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import OwnerSettings from './pages/OwnerSetting'
import OwnerMessage from './pages/OwnerMessage'
import AdminProperties from './pages/AdminProperties'
import OwnerList from './pages/OwnerList'
import TenantsList from './pages/TenantsList'
import PaymentData from './pages/PaymentData'
import AdminSetting from './pages/AdminSetting'
import AdminTenantDetails from './pages/AdminTenantDetails';
import ForgotPassword from './pages/ForgotPassword';
import OwnerForgotPassword from './pages/OwnerForgotPassword';
import AdminOTP from './pages/AdminOTP';
import PropertyDetails from './pages/PropertyDetails';
import AddPropertyformember from './pages/AddPropertyformember';
import AdminMessages from './pages/AdminMessage'

export const AuthContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        } else if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      <SlideTransition>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-signup" element={<OwnerSignup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/owner/add-property" element={<OwnerAddProperty />} />
          <Route path="/owner/my-properties" element={<OwnerMyProperties />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/membership-plans" element={<MembershipPlans />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/owner/settings" element={<OwnerSettings />} />
          <Route path="/owner/messages" element={<OwnerMessage />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/owners" element={<OwnerList />} />
          <Route path="/admin/tenants" element={<TenantsList />} />
          <Route path="/admin/payments" element={<PaymentData />} />
          <Route path="/admin/settings" element={<AdminSetting />} />
          <Route path="/admin/tenant-details" element={<AdminTenantDetails />} />
          <Route path="/admin/tenants/:id" element={<AdminTenantDetails />} />
          <Route path="/admin/tenant-details/:id" element={<AdminTenantDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/owner-forgot-password" element={<OwnerForgotPassword />} />
          <Route path="/admin-otp" element={<AdminOTP />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/add-property-formember" element={<AddPropertyformember />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
        </Routes>
      </SlideTransition>
    </AuthContext.Provider>
  )
}

export default App

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';

const navOptions = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
];

export default function NavBar({ typingEffect = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [typedLabels, setTypedLabels] = useState(navOptions.map(() => ''));
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!typingEffect) return;
    let timeouts = [];
    navOptions.forEach((option, idx) => {
      for (let i = 0; i <= option.label.length; i++) {
        timeouts.push(
          setTimeout(() => {
            setTypedLabels((prev) => {
              const updated = [...prev];
              updated[idx] = option.label.slice(0, i) || '\u00A0';
              return updated;
            });
          }, 100 * i + idx * 300)
        );
      }
    });
    return () => timeouts.forEach(clearTimeout);
  }, [typingEffect]);

  useEffect(() => {
    // Check login status on mount and on storage change (for session sync)
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="w-full">
      <div className="mx-auto flex justify-center items-center">
        {/* Hamburger only on mobile, right end */}
        <button className="sm:hidden text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          <HiMenu className="h-7 w-7" />
        </button>
        {/* Desktop/Laptop nav: always visible, horizontal */}
        <ul className="hidden sm:flex flex-row gap-8 text-white">
          {navOptions.map((option, idx) => (
            <li key={option.path} className={`cursor-pointer ${location.pathname === option.path ? 'border-b-2 border-white' : ''}`}>
              <Link to={option.path} tabIndex={0} style={{ pointerEvents: 'auto' }}>
                {typingEffect ? (typedLabels[idx] || '\u00A0') : option.label}
              </Link>
            </li>
          ))}
          {/* Desktop: show Sign In/Profile/Logout on right */}
        </ul>
        {/* Mobile nav: vertical, only when open */}
        <ul className={`flex-col gap-4 text-white absolute sm:hidden top-14 right-4 bg-blue-800 rounded-md p-4 shadow-lg z-50 transition-all duration-200 ${menuOpen ? 'flex' : 'hidden'}`}>
          {navOptions.map((option, idx) => (
            <li key={option.path} className={`cursor-pointer ${location.pathname === option.path ? 'border-b-2 border-white' : ''}`}>
              <Link to={option.path} tabIndex={0} style={{ pointerEvents: 'auto' }} onClick={() => setMenuOpen(false)}>
                {typingEffect ? (typedLabels[idx] || '\u00A0') : option.label}
              </Link>
            </li>
          ))}
          {/* Mobile: show Sign In/Profile/Logout in hamburger */}
          {!isLoggedIn ? (
            <li>
              <button className="w-full mt-2 px-4 py-2 bg-white text-blue-800 rounded font-semibold hover:bg-blue-100" onClick={() => { setMenuOpen(false); navigate('/login'); }}>
                Sign In
              </button>
            </li>
          ) : (
            <>
              <li>
                <button className="w-full mt-2 px-4 py-2 bg-white text-blue-800 rounded font-semibold hover:bg-blue-100" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                  Profile
                </button>
              </li>
              <li>
                <button className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

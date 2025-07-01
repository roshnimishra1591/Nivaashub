import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navOptions = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy-policy' }, // Added Privacy Policy
];

export default function NavBar({ typingEffect = false }) {
  const location = useLocation();
  const [typedLabels, setTypedLabels] = useState(navOptions.map(() => ''));

  useEffect(() => {
    if (!typingEffect) return;
    let timeouts = [];
    navOptions.forEach((option, idx) => {
      for (let i = 0; i <= option.label.length; i++) {
        timeouts.push(
          setTimeout(() => {
            setTypedLabels((prev) => {
              const updated = [...prev];
              updated[idx] = option.label.slice(0, i) || '\u00A0'; // always at least a space
              return updated;
            });
          }, 100 * i + idx * 300)
        );
      }
    });
    return () => timeouts.forEach(clearTimeout);
  }, [typingEffect]);

  return (
    <ul className="flex gap-8 text-white">
      {navOptions.map((option, idx) => (
        <li key={option.path} className={`cursor-pointer ${location.pathname === option.path ? 'border-b-2 border-white' : ''}`}>
          <Link to={option.path} tabIndex={0} style={{ pointerEvents: 'auto' }}>
            {typingEffect ? (typedLabels[idx] || '\u00A0') : option.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

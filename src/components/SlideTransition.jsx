import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Helper to determine direction
function getDirection(prev, next) {
  const order = ['/', '/rooms', '/services', '/about', '/contact'];
  const prevIdx = order.indexOf(prev);
  const nextIdx = order.indexOf(next);
  if (prevIdx === -1 || nextIdx === -1) return 'right';
  return nextIdx > prevIdx ? 'right' : 'left';
}

export default function SlideTransition({ children }) {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(children);
  const [slide, setSlide] = useState(false);
  const [direction, setDirection] = useState('right');
  const prevLocation = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setDisplayed(children);
      isFirstRender.current = false;
      prevLocation.current = location.pathname;
      return;
    }
    if (location.pathname !== prevLocation.current) {
      const dir = getDirection(prevLocation.current, location.pathname);
      setDirection(dir);
      setSlide(true);
      setTimeout(() => {
        setDisplayed(children);
        setSlide(false);
        prevLocation.current = location.pathname;
      }, 400);
    } else {
      setDisplayed(children);
    }
  }, [location, children]);

  // Animation classes
  const outClass = direction === 'right' ? '-translate-x-full' : 'translate-x-full';
  const inClass = 'translate-x-0';

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <div
        className={`transition-transform duration-400 ease-in-out ${slide ? outClass : inClass}`}
        style={{ position: 'absolute', width: '100%' }}
      >
        {slide ? displayed : children}
      </div>
      {!slide && (
        <div style={{ position: 'absolute', width: '100%' }}>
          {children}
        </div>
      )}
    </div>
  );
}

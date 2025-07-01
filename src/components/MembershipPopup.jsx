import React from "react";

export default function MembershipPopup({
  open,
  onClose,
  onStart,
  forceHide,
}) {
  if (forceHide) return null;
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 membership-popup"
      style={{
        backdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative animate-fadeInUp border border-blue-200">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 mb-4 text-blue-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="#e0f2fe"
            />
            <path
              d="M8 12l2 2 4-4"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <h2 className="text-2xl font-extrabold mb-2 text-blue-900 text-center drop-shadow">
            Start Your Membership
          </h2>
          <p className="mb-6 text-center text-gray-600 text-base">
            Join NivaasHub to unlock all features and start your journey!
          </p>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-semibold text-lg shadow hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
            onClick={onStart}
          >
            Start Membership
          </button>
        </div>
      </div>
    </div>
  );
}

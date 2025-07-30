import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import esewaLogo from "../assets/esewalogo.png";
import esewaQR from "../assets/esewaQR.jpg"; // Import the eSewa QR code image
import silverLogo from "../assets/Silver.png";
import goldLogo from "../assets/Gold-Membership.png";
import platinumLogo from "../assets/Platinum-Membership.png";
import { addMember } from "../apiMember"; 
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaUniversity, FaSadTear } from 'react-icons/fa'; // Added FaSadTear icon

// Reusable component for payment option buttons
const PaymentOptionButton = ({ name, icon, isSelected, onClick, colorClass }) => (
  <button
    type="button" // Important: These are type="button" to prevent form submission
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center p-3 rounded-md border-2 text-gray-700 transition-all duration-200 ease-in-out
      ${isSelected ? `${colorClass} shadow-md scale-105` : "border-gray-300 hover:border-blue-400 hover:scale-105"}
      transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected ? `focus:ring-${colorClass.split('-')[1]}` : 'focus:ring-blue-500'}
    `}
  >
    {typeof icon === 'string' ? (
      <img src={icon} alt={name} className="h-8 w-8 object-contain mb-1" />
    ) : (
      React.createElement(icon, { className: "h-8 w-8 text-gray-700 mb-1" }) // Render icon component
    )}
    <span className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>
      {name}
    </span>
    {isSelected && (
      <svg className="absolute top-1 right-1 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
  </button>
);

export default function Payment() {
  const [memberName, setMemberName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Bank details states are kept for potential future use, but not rendered in the 'bank' section as per request
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranchName, setBankBranchName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("esewa"); // Default to eSewa payment now
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // States for transaction details (used for eSewa popup)
  const [showEsewaTransactionPopup, setShowEsewaTransactionPopup] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [paymentDoneNumber, setPaymentDoneNumber] = useState("");
  const [payerName, setPayerName] = useState(""); // Name of the person who made the payment

  // Plan logo fallback logic
  const planLogos = {
    silver: silverLogo,
    gold: goldLogo,
    platinum: platinumLogo,
  };

  let plan = location.state?.plan;
  if (!plan) {
    const planParam = searchParams.get("plan");
    if (planParam) {
      if (planParam === "silver") plan = { name: "Silver", price: 700, duration: "1 Month", logo: silverLogo, features: ["Up to 5 room bookings", "Standard support", "Access to basic listings"] };
      if (planParam === "gold") plan = { name: "Gold", price: 1000, duration: "1 Month", logo: goldLogo, features: ["Unlimited room bookings", "Priority support", "Exclusive discounts", "Access to premium listings"] };
      if (planParam === "platinum") plan = { name: "Platinum", price: 1300, duration: "1 Month", logo: platinumLogo, features: ["Unlimited bookings", "24/7 VIP support", "Highest discounts", "Access to all listings", "Personal account manager"] };
    }
  }
  if (!plan) {
    plan = { name: "Gold", price: 1000, duration: "1 Month", logo: goldLogo, features: ["Unlimited room bookings", "Priority support", "Exclusive discounts", "Access to premium listings"] };
  }

  const membershipPlan = plan;

  // Set email and name from logged-in user in localStorage on mount
  useEffect(() => {
    let foundEmail = false;
    let foundName = false;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.email) {
          setEmail(userObj.email);
          foundEmail = true;
        }
        if (userObj && userObj.name) {
          setMemberName(userObj.name);
          setPayerName(userObj.name); // Pre-fill payer name with logged-in user's name
          foundName = true;
        }
      } catch (e) {}
    }
    if (!foundEmail || !foundName) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              if (!foundEmail && data.user && data.user.email) setEmail(data.user.email);
              if (!foundName && data.user && data.user.name) {
                setMemberName(data.user.name);
                setPayerName(data.user.name);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  // Function to handle the final submission of membership details
  const submitMembership = async (paymentMethod, details) => {
    setLoading(true);
    setError("");
    setSuccess(false); // Reset success state before new submission

    try {
      await addMember({
        memberName,
        email,
        phoneNumber,
        address,
        membershipPlan: membershipPlan.name,
        amountPaid: membershipPlan.price,
        paymentMethod: paymentMethod,
        paymentDetails: details,
        status: "pending", // Always set status to pending for admin approval
      });
      setSuccess(true);
      setError("");
      // Redirect to home or a confirmation page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Membership submission error:", err);
      setError("Could not confirm membership. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle initiation of payment (before going to transaction details popup or direct submission)
  const handleInitiatePayment = async () => {
    setError("");
    if (!memberName || !email || !phoneNumber || !address) {
      setError("Please fill in your personal details first.");
      return;
    }

    if (method === "esewa") {
      // For eSewa, show the transaction details popup
      setShowEsewaTransactionPopup(true);
    } else if (method === "bank") {
      // For Bank, show an error message as it's not available
      setError("Bank transfer is currently unavailable. Please choose eSewa or try again later.");
    }
  };

  // This function is called when the user submits transaction details from the eSewa popup
  const handleConfirmEsewaPayment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!transactionCode || !paymentDoneNumber || !payerName) {
      setError("Please fill all transaction details.");
      setLoading(false);
      return;
    }

    await submitMembership("esewa", {
      transactionCode,
      paymentDoneNumber,
      payerName,
    });

    setShowEsewaTransactionPopup(false); // Close popup after submission attempt
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-2 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200">
        <div className="flex items-center justify-center mb-3">
          <img src={planLogos[membershipPlan.name.toLowerCase()]} alt={membershipPlan.name + " logo"} className="w-12 h-12 rounded-full bg-white p-1 shadow mr-3" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            {membershipPlan.name} Membership
          </h1>
        </div>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Unlock exclusive benefits for your room rental experience.
        </p>

        {/* Membership Details Section */}
        <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 text-base">Price:</span>
            <span className="text-green-600 font-bold text-xl">
              NPR {membershipPlan.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 text-base">Duration:</span>
            <span className="font-semibold text-base">{membershipPlan.duration}</span>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
            {membershipPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="text-blue-600 underline text-xs font-semibold hover:text-blue-800 transition"
              onClick={() => navigate("/membership-plans")}
            >
              Change Plan
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mb-4 flex items-center text-sm">
            <FaTimesCircle className="mr-2" />
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-4 flex items-center text-sm">
            <FaCheckCircle className="mr-2" />
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">
              Payment details submitted for review. Redirecting to your dashboard...
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center mb-4 text-blue-600 font-semibold text-sm">
            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
            Processing Payment...
          </div>
        )}

        {!success && !loading && !showEsewaTransactionPopup && (
          <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission here */}
            {/* Personal Details */}
            <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Your Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed select-none focus:outline-none focus:ring-0 text-sm"
                value={memberName}
                disabled
                readOnly
                tabIndex={-1}
                autoComplete="off"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed select-none focus:outline-none focus:ring-0 text-sm"
                value={email}
                disabled
                readOnly
                tabIndex={-1}
                autoComplete="off"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number (e.g., 98XXXXXXXX)"
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                maxLength={15}
              />
              <input
                type="text"
                placeholder="Address (Street, City, Country)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="block mb-3 font-semibold text-gray-800 text-base">
                Choose Payment Method
              </h3>
              <div className="grid grid-cols-2 gap-3"> {/* Two columns for eSewa and Bank */}
                <PaymentOptionButton
                  name="eSewa"
                  icon={esewaLogo}
                  isSelected={method === "esewa"}
                  onClick={() => setMethod("esewa")}
                  colorClass="bg-green-600 border-green-600"
                />
                <PaymentOptionButton
                  name="Bank Transfer"
                  icon={FaUniversity} // Using FaUniversity icon
                  isSelected={method === "bank"}
                  onClick={() => setMethod("bank")}
                  colorClass="bg-indigo-600 border-indigo-600"
                />
              </div>
            </div>

            {/* Conditional Display for Bank Details or QR Code */}
            {method === "esewa" && (
              <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Scan to Pay with eSewa</h3>
                <img
                  src={esewaQR} // Using the imported esewaQR image
                  alt="eSewa QR Code"
                  className="mx-auto mb-3 rounded-md shadow-sm w-32 h-32" // Smaller QR code
                />
                <p className="text-gray-700 text-xs">
                  Scan this QR code using your eSewa app to complete the payment of{" "}
                  <span className="font-bold">NPR {membershipPlan.price.toLocaleString()}</span>.
                </p>
                <p className="text-gray-700 text-xs mt-2">
                  After scanning, please enter the transaction details on the next page.
                </p>
                <p className="text-gray-700 text-xs mt-2">
                  If you have any issues, please contact us at{" "}
                  <a href="mailto:nivaashub@outlook.com" className="text-blue-600 hover:underline">
                    nivaashub@outlook.com
                  </a>
                </p>
                {/* Button for eSewa only */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-bold text-base hover:bg-blue-700 transition duration-300 ease-in-out shadow-md transform hover:scale-105"
                  >
                    Proceed to Payment Confirmation
                  </button>
                </div>
              </div>
            )}

            {method === "bank" && (
              <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Bank Transfer Details</h3>
                <div className="space-y-3 mt-5 mb-5 flex flex-col items-center">
                  <FaSadTear className="text-red-500 text-9xl mb-2" /> {/* Crying emoji/icon */}
                  <h1 className="text-lg font-semibold text-gray-700">We will be available soon!!</h1>
                  <p className="text-gray-600 text-xs mt-2">
                    Bank transfer is currently unavailable. Please choose eSewa or try again later.
                  </p>
                </div>
              </div>
            )}
            <div>
              <p>
                By proceeding, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.

              </p>
            </div>
          </form>
        )}

        {/* Transaction Details Popup (Conditional Render - only for eSewa) */}
        {showEsewaTransactionPopup && !success && !loading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center p-2 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm border border-gray-200 relative">
              <button
                type="button"
                onClick={() => setShowEsewaTransactionPopup(false)} // Close popup
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Confirm Your eSewa Payment
              </h2>
              <p className="text-gray-600 text-center mb-4 text-sm">
                Please enter the details from your completed eSewa transaction.
              </p>
              <form onSubmit={handleConfirmEsewaPayment} className="space-y-4">
                <div>
                  <label htmlFor="transactionCode" className="block text-xs font-medium text-gray-700 mb-1">
                    Transaction Code / Reference ID
                  </label>
                  <input
                    type="text"
                    id="transactionCode"
                    placeholder="e.g., TXN123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="paymentDoneNumber" className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Done Number (Your Phone/Account Number)
                  </label>
                  <input
                    type="text"
                    id="paymentDoneNumber"
                    placeholder="e.g., 98XXXXXXXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                    value={paymentDoneNumber}
                    onChange={(e) => setPaymentDoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="payerName" className="block text-xs font-medium text-gray-700 mb-1">
                    Payer Name
                  </label>
                  <input
                    type="text"
                    id="payerName"
                    placeholder="Name on the payment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative text-center text-xs">
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-md font-bold text-base hover:bg-green-700 transition duration-300 ease-in-out shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <> <FaSpinner className="animate-spin mr-2" /> Submitting... </>
                  ) : (
                    `Confirm Payment`
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

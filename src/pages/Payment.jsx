import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import esewaLogo from "../assets/esewalogo.png";
import khaltiLogo from "../assets/khaltilogo.png";
import imepayLogo from "../assets/imepay.png";
import silverLogo from "../assets/Silver.png";
import goldLogo from "../assets/Gold-Membership.png";
import platinumLogo from "../assets/Platinum-Membership.png";
import { addMember } from "../apiMember";

// Helper function for card number formatting
const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, ""); // Remove non-digits and spaces
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  }
  return value;
};

// Helper function for expiry date formatting
const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length > 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
};

// Function to detect card type (simple example)
const getCardType = (cardNumber) => {
  cardNumber = cardNumber.replace(/\s/g, ""); // Remove spaces for detection
  if (/^4/.test(cardNumber)) {
    return { name: "Visa", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" };
  }
  if (/^5[1-5]/.test(cardNumber)) {
    return { name: "MasterCard", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png" };
  }
  if (/^3[47]/.test(cardNumber)) {
    return { name: "American Express", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/800px-American_Express_logo_%282018%29.svg.png" };
  }
  // Add more card types as needed (Discover, Rupay, etc.)
  return { name: "", icon: "" }; // Unknown
};

export default function Payment() {
  const [memberName, setMemberName] = useState(""); // Name of the member
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added for membership
  const [address, setAddress] = useState(""); // Added for membership

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState(""); // New: Card Holder Name
  const [bankName, setBankName] = useState(""); // New: Bank Name (Optional)

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("card"); // Default to card payment
  const location = useLocation();
  const [searchParams] = useSearchParams(); // To read URL parameters for eSewa/Khalti success/failure
  const navigate = useNavigate();

  // Plan logo fallback logic
  const planLogos = {
    silver: silverLogo,
    gold: goldLogo,
    platinum: platinumLogo,
  };

  // Get plan from navigation state or fallback to query string or default
  let plan = location.state?.plan;
  if (!plan) {
    const planParam = searchParams.get("plan");
    if (planParam) {
      // Fallback: reconstruct plan from param (minimal info)
      if (planParam === "silver") plan = { name: "Silver", price: 700, duration: "1 Month", logo: silverLogo, features: ["Up to 5 room bookings", "Standard support", "Access to basic listings"] };
      if (planParam === "gold") plan = { name: "Gold", price: 1000, duration: "1 Month", logo: goldLogo, features: ["Unlimited room bookings", "Priority support", "Exclusive discounts", "Access to premium listings"] };
      if (planParam === "platinum") plan = { name: "Platinum", price: 1300, duration: "1 Month", logo: platinumLogo, features: ["Unlimited bookings", "24/7 VIP support", "Highest discounts", "Access to all listings", "Personal account manager"] };
    }
  }
  if (!plan) {
    // Default to Gold if nothing found
    plan = { name: "Gold", price: 1000, duration: "1 Month", logo: goldLogo, features: ["Unlimited room bookings", "Priority support", "Exclusive discounts", "Access to premium listings"] };
  }

  // Membership details (use selected plan)
  const membershipPlan = plan;

  // eSewa configuration (simplified for demo)
  const esewaConfig = {
    amt: membershipPlan.price,
    psc: 0,
    pdc: 0,
    tAmt: membershipPlan.price,
    pid: `NIVAASHUB_MEMBERSHIP_${Date.now()}`, // Unique product id
    scd: "EPAYTEST", // Use your real eSewa merchant code in production
    su: `${window.location.origin}/payment?esewa=success&pid=${encodeURIComponent(`NIVAASHUB_MEMBERSHIP_${Date.now()}`)}`, // Success URL with pid
    fu: `${window.location.origin}/payment?esewa=failure`, // Failure URL
  };

  // Khalti configuration (simplified for demo)
  const khaltiConfig = {
    publicKey: "test_public_key_xxxx", // Replace with your actual Khalti Public Key
    productIdentity: `NIVAASHUB_MEMBERSHIP_${Date.now()}`,
    productName: membershipPlan.name,
    productUrl: window.location.origin,
    eventHandler: {
      onSuccess(payload) {
        console.log("Khalti Success:", payload);
        // Verify payment on your backend using payload.token and payload.amount
        // Then, update membership status
        handleSuccessfulPayment("khalti", payload);
      },
      onError(error) {
        console.log("Khalti Error:", error);
        setError("Khalti payment failed. Please try again.");
      },
      onClose() {
        console.log("Khalti widget closed.");
      },
    },
  };

  // Check for payment status from URL parameters (eSewa, Khalti)
  useEffect(() => {
    const esewaStatus = searchParams.get("esewa");
    const khaltiStatus = searchParams.get("khalti"); // For conceptual Khalti redirects

    if (esewaStatus === "success") {
      const pid = searchParams.get("pid");
      // In a real app, you would send this pid to your backend to verify the eSewa transaction
      // For this demo, we'll just assume success
      setLoading(true); // Simulate backend verification
      setTimeout(() => {
        handleSuccessfulPayment("esewa", { pid });
      }, 1500);
    } else if (esewaStatus === "failure") {
      setError("eSewa payment failed or was cancelled.");
    }

    // You would typically verify Khalti payments server-side after the callback
    // This is a simplified client-side check.
    if (khaltiStatus === "success") {
      setLoading(true);
      setTimeout(() => {
        handleSuccessfulPayment("khalti", {});
      }, 1500);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
          foundName = true;
        }
      } catch (e) {}
    }
    // If not found, fetch from backend
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
              if (!foundName && data.user && data.user.name) setMemberName(data.user.name);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleEsewaPay = async () => {
    setError("");
    if (!memberName || !email || !phoneNumber || !address) {
      setError("Please fill in your personal details first.");
      return;
    }
    setLoading(true);
    try {
      await addMember({
        memberName,
        email,
        phoneNumber,
        address,
        membershipPlan: membershipPlan.name,
        amountPaid: membershipPlan.price,
        paymentMethod: "esewa",
        paymentDetails: {},
      });
      setSuccess(true);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Could not add membership. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKhaltiPay = async () => {
    setError("");
    if (!memberName || !email || !phoneNumber || !address) {
      setError("Please fill in your personal details first.");
      return;
    }
    setLoading(true);
    try {
      await addMember({
        memberName,
        email,
        phoneNumber,
        address,
        membershipPlan: membershipPlan.name,
        amountPaid: membershipPlan.price,
        paymentMethod: "khalti",
        paymentDetails: {},
      });
      setSuccess(true);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Could not add membership. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // This function will be called after payment is successful (for all methods)
  const handleSuccessfulPayment = async (paymentMethod, paymentData) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // 1. Add membership in MongoDB (memberships collection)
      // 2. Update user in MongoDB: isMember: true, set expiry
      await addMember({
        memberName,
        email,
        phoneNumber,
        address,
        membershipPlan: membershipPlan.name,
        amountPaid: membershipPlan.price,
        paymentMethod,
        paymentDetails: paymentData || {},
      });
      // Optionally, you can call another API to update the user, if not handled in addMember
      // await updateUserMembershipStatus(email, true, expiryDate)
      setSuccess(true);
      setError("");
      navigate("/");
    } catch (err) {
      setError("Could not activate membership. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission initially
    setError("");
    setLoading(true);

    if (!memberName || !email || !phoneNumber || !address) {
      setError("Please fill all personal details.");
      setLoading(false);
      return;
    }

    // This handleSubmit is specifically for "card" method.
    // Other methods trigger their payment flows via their respective onClick handlers.
    if (method === "card") {
      if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
        setError("Please fill all card details (Card Holder Name, Number, Expiry, CVV).");
        setLoading(false);
        return;
      }
      // Basic client-side validation for card
      if (cardNumber.replace(/\s/g, "").length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ""))) {
        setError("Invalid card number. Must be 16 digits.");
        setLoading(false);
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError("Invalid expiry date format (MM/YY).");
        setLoading(false);
        return;
      }
      const [month, year] = expiryDate.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
        setError("Expiry date is in the past or invalid.");
        setLoading(false);
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("Invalid CVV. Must be 3 or 4 digits.");
        setLoading(false);
        return;
      }

      // No backend call, just redirect
      setSuccess(true);
      setError("");
      navigate("/");
      setLoading(false);
    }
    // If not a card method, the form's onSubmit itself will be prevented (as set below)
    // and the specific button's onClick handler will take care of the logic.
    // So, no need for an 'else' block here.
  };

  // Reusable component for payment option buttons
  const PaymentOptionButton = ({ name, icon, isSelected, onClick, colorClass }) => (
    <button
      type="button" // Important: These are type="button" to prevent form submission
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 text-gray-700 transition-all duration-200 ease-in-out
        ${isSelected ? `${colorClass} shadow-lg scale-105` : "border-gray-300 hover:border-blue-400 hover:scale-105"}
        transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected ? `focus:ring-${colorClass.split('-')[1]}` : 'focus:ring-blue-500'}
      `}
    >
      <img src={icon} alt={name} className="h-10 w-10 object-contain mb-2" />
      <span className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-white' : 'text-gray-800'}`}>
        {name}
      </span>
      {isSelected && (
        <svg className="absolute top-2 right-2 w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  const cardType = getCardType(cardNumber);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl border border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <img src={membershipPlan.logo} alt={membershipPlan.name + " logo"} className="w-16 h-16 rounded-full bg-white p-1 shadow mr-4" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            {membershipPlan.name} Membership
          </h1>
        </div>
        <p className="text-center text-gray-600 mb-8">
          Unlock exclusive benefits for your room rental experience.
        </p>

        {/* Membership Details Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 text-lg">Price:</span>
            <span className="text-green-600 font-bold text-2xl">
              NPR {membershipPlan.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 text-lg">Duration:</span>
            <span className="font-semibold text-lg">{membershipPlan.duration}</span>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {membershipPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="text-blue-600 underline text-sm font-semibold hover:text-blue-800 transition"
              onClick={() => navigate("/membership-plans")}
            >
              Change Plan
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">
              Payment Successful! Redirecting to your dashboard...
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center mb-6 text-blue-600 font-semibold">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </div>
        )}

        {(!success && !loading) && (
          <form onSubmit={method === "card" ? handleSubmit : (e) => e.preventDefault()}>
            {/* Personal Details */}
            <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed select-none focus:outline-none focus:ring-0"
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
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed select-none focus:outline-none focus:ring-0"
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
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                maxLength={15}
              />
              <input
                type="text"
                placeholder="Address (Street, City, Country)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="block mb-3 font-semibold text-gray-800 text-lg">
                Choose Payment Method
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PaymentOptionButton
                  name="Card"
                  icon="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  isSelected={method === "card"}
                  onClick={() => setMethod("card")}
                  colorClass="bg-blue-600 border-blue-600"
                />
                <PaymentOptionButton
                  name="eSewa"
                  icon={esewaLogo}
                  isSelected={method === "esewa"}
                  onClick={() => setMethod("esewa")}
                  colorClass="bg-green-600 border-green-600"
                />
                <PaymentOptionButton
                  name="Khalti"
                  icon={khaltiLogo}
                  isSelected={method === "khalti"}
                  onClick={() => setMethod("khalti")}
                  colorClass="bg-purple-600 border-purple-600"
                />
                <PaymentOptionButton
                  name="IME Pay"
                  icon={imepayLogo}
                  isSelected={method === "imepay"}
                  onClick={() => setMethod("imepay")}
                  colorClass="bg-red-600 border-red-600"
                />
              </div>
            </div>

            {/* Card Details and Card Button - Only if method is 'card' */}
            {method === "card" && (
              <>
                <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Card Details</h3>
                  <div className="mb-4">
                    <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name
                    </label>
                    <input
                      id="cardHolderName"
                      type="text"
                      placeholder="e.g., Jane Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9\s]{13,19}"
                      autoComplete="cc-number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      required
                      maxLength={19}
                    />
                    {cardType.icon && (
                      <img
                        src={cardType.icon}
                        alt={cardType.name}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto"
                        title={cardType.name}
                      />
                    )}
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        inputMode="numeric"
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        required
                        maxLength={5}
                      />
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="password"
                        inputMode="numeric"
                        pattern="\d{3,4}"
                        placeholder="CVV"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/gi, ""))}
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      id="bankName"
                      type="text"
                      placeholder="e.g., Nabil Bank"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                </div>
                {/* Error message above the button */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-center">
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay NPR ${membershipPlan.price.toLocaleString()} & Join`}
                </button>
              </>
            )}

            {/* Other Payment Methods - Only if method is not 'card' */}
            {method !== "card" && (
              <>
                <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="mb-2 font-semibold text-yellow-800 text-lg">
                    Proceed with <span className="capitalize">{method}</span>
                  </p>
                  <p className="text-sm text-yellow-700">
                    Click the "{method === "esewa" ? "Pay with eSewa" : method === "khalti" ? "Pay with Khalti" : method === "imepay" ? "Pay with IME Pay" : "Proceed to Pay"}" button below. You will be redirected to the
                    respective payment gateway to complete your transaction.
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    (Note: This is a demo. Actual integration requires specific SDKs/APIs and server-side verification.)
                  </p>
                </div>
                {method === "esewa" && (
                  <button
                    type="button"
                    onClick={handleEsewaPay}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                    disabled={loading}
                  >
                    <img
                      src={esewaLogo}
                      alt="eSewa"
                      className="w-8 h-8"
                    />
                    {loading ? "Redirecting..." : `Pay with eSewa (NPR ${membershipPlan.price.toLocaleString()})`}
                  </button>
                )}
                {method === "khalti" && (
                  <button
                    type="button"
                    onClick={handleKhaltiPay}
                    className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                    disabled={loading}
                  >
                    <img
                      src={khaltiLogo}
                      alt="Khalti"
                      className="w-8 h-8"
                    />
                    {loading ? "Opening Khalti..." : `Pay with Khalti (NPR ${membershipPlan.price.toLocaleString()})`}
                  </button>
                )}
                {method === "imepay" && (
                  <button
                    type="button"
                    onClick={async () => {
                      setError("");
                      if (!memberName || !email || !phoneNumber || !address) {
                        setError("Please fill in your personal details first.");
                        return;
                      }
                      setLoading(true);
                      try {
                        await addMember({
                          memberName,
                          email,
                          phoneNumber,
                          address,
                          membershipPlan: membershipPlan.name,
                          amountPaid: membershipPlan.price,
                          paymentMethod: "imepay",
                          paymentDetails: {},
                        });
                        setSuccess(true);
                        setError("");
                        navigate("/");
                      } catch (err) {
                        setError("Could not add membership. Please try again.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                    disabled={loading}
                  >
                    <img
                      src={imepayLogo}
                      alt="IME Pay"
                      className="w-8 h-8"
                    />
                    {loading ? "Redirecting..." : `Pay with IME Pay (NPR ${membershipPlan.price.toLocaleString()})`}
                  </button>
                )}
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
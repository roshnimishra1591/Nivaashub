import React from "react";
import { useNavigate } from "react-router-dom";
import silverLogo from "../assets/Silver.png";
import goldLogo from "../assets/Gold-Membership.png";
import platinumLogo from "../assets/Platinum-Membership.png";

const plans = [
	{
		name: "Silver",
		price: 700, // 30% less than 1000
		duration: "1 Month",
		logo: silverLogo,
		features: [
			"Up to 5 room bookings",
			"Standard support",
			"Access to basic listings",
		],
	},
	{
		name: "Gold",
		price: 1000, // base
		duration: "1 Month",
		logo: goldLogo,
		features: [
			"Unlimited room bookings",
			"Priority support",
			"Exclusive discounts",
			"Access to premium listings",
		],
	},
	{
		name: "Platinum",
		price: 1300, // 30% more than 1000
		duration: "1 Month",
		logo: platinumLogo,
		features: [
			"Unlimited bookings",
			"24/7 VIP support",
			"Highest discounts",
			"Access to all listings",
			"Personal account manager",
		],
	},
];

export default function MembershipPlans() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12">
			<div className="w-full flex justify-center bg-gray-100 py-6 -mt-15 mb-10 shadow">
				<div className="flex items-center gap-4">
					<img
						src="/logo.png"
						alt="NivaasHub Logo"
						className="w-14 h-14 rounded-full bg-white p-1 shadow"
					/>
					<h1 className="text-4xl font-extrabold text-gray-800">NivaasHub</h1>
				</div>
			</div>
			<h2 className="text-3xl font-bold mb-8 text-blue-800">
				Choose Your Membership
			</h2>
			<div className="flex flex-col md:flex-row gap-8">
				{plans.map((plan) => (
					<div
						key={plan.name}
						className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200 w-80 hover:scale-105 transition-transform"
					>
						<img
							src={plan.logo}
							alt={plan.name + " logo"}
							className="w-20 h-20 mb-4"
						/>
						<h2 className="text-2xl font-bold mb-2 text-blue-700">
							{plan.name}
						</h2>
						<div className="text-3xl font-extrabold text-green-600 mb-2">
							NPR {plan.price}
						</div>
						<div className="text-gray-600 mb-4">{plan.duration}</div>
						<ul className="list-disc list-inside text-gray-700 mb-6 text-left">
							{plan.features.map((f, i) => (
								<li key={i}>{f}</li>
							))}
						</ul>
						<button
							className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-lg hover:bg-blue-700 transition"
							onClick={() =>
								navigate("/payment", { state: { plan } })
							}
						>
							Select {plan.name}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

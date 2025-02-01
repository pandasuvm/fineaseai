import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firebase instance
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Slider } from "@mui/material"; // For the sliders (Amount, Duration, ROI)
import { format } from "date-fns"; // For formatting dates
import Loader from "../components/LoaderPage"; // Import the Loader component
import GradientText from "../components/GradientText";
import { TrendingUp, TrendingDown } from "lucide-react";
// import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const data = [
  { name: "Jan", uv: 1000 }, // Keep initial value
  { name: "Feb", uv: 1300 }, // Smooth transition between Jan and Feb
  { name: "Mar", uv: 1250 }, // Smooth transition between Feb and Mar
  { name: "Apr", uv: 1400 }, // Smooth transition between Mar and Apr
  { name: "May", uv: 1950 }, // Smooth transition between Apr and May
  { name: "Jun", uv: 1450 }, // Smooth transition between May and Jun
  { name: "Jul", uv: 1300 }, // Smooth transition between Jun and Jul

  // { name: 'Aug', uv: 1490 },
  // { name: 'Sep', uv: 1490 },
  // { name: 'Oct', uv: 1490 },
  // { name: 'Nov', uv: 1490 },
  // { name: 'Dec', uv: 1490 },
];
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: 4000,
    duration: 2, // in years
    roi: 5, // in percentage
  });
  const [emiData, setEmiData] = useState({
    monthlyEmi: 0,
    principalAmount: 0,
    totalInterest: 0,
  });
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions(user.uid);
    }
  }, [user]);

  const fetchTransactions = async (userId) => {
    try {
      setLoading(true); // Show loader when fetching data
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map((doc) => doc.data());
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false); // Hide loader after fetching data
    }
  };

  const handleSliderChange = (e, newValue) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const calculateEMI = () => {
    const principal = formData.amount;
    const roi = formData.roi / 100 / 12; // Monthly interest rate
    const durationInMonths = formData.duration * 12; // Convert years to months

    // EMI calculation formula
    const emi =
      (principal * roi * Math.pow(1 + roi, durationInMonths)) /
      (Math.pow(1 + roi, durationInMonths) - 1);

    const totalInterest = emi * durationInMonths - principal;

    setEmiData({
      monthlyEmi: emi.toFixed(2),
      principalAmount: principal.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    });
  };

  useEffect(() => {
    calculateEMI();
  }, [formData]);

  return (
    <div className="dashboard-container p-4 bg-black">
      {loading && <Loader />} {/* Show loader if loading is true */}
      <div className="flex">
        <div className="main-content w-7/10 pr-4">
          <div className="welcome-message mb-4">
            <h1 className="text-2xl font-bold">
              Welcome back {user ? user.displayName : "User"}
            </h1>
            <p className="text-gray-600 mt-2">AI LOAN RECOMMENDER</p>
          </div>
          <div className="flex mb-4 gap-4">
            <div className="w-6/10 flex flex-col gap-4">
              <div className="small-card rounded-full p-4 pb-0 w-full relative">
                {/* GradientText */}
                <GradientText
                  colors={[
                    "#E3FDF5",
                    "#D1F3E0",
                    "#B2E8D0",
                    "#98D9C1",
                    "#7CCBA9",
                    "#64BBA2",
                    "#4DAF96",
                    "#3F9D8A",
                    "#358E7D",
                    "#2A7C6F",
                    "#216A61",
                    "#1A5852",
                    "#134744",
                    "#0D3537",
                    "#07262A",
                  ]}
                  animationSpeed={5}
                  showBorder={true}
                  className="pl-5 pr-5 pt-3 pb-3 text-xl w-full flex justify-center items-center"
                >
                  Try our new AI Loan recommender
                </GradientText>

                {/* Image on the Top Right Corner */}
                <img
                  src="components/Images/ai.png" // Replace with your image path
                  alt="AI Loan Recommender"
                  className="w-10 h-10 rounded-full absolute top-1 right-8 transform translate-x-1/2 translate-y-[-50%]"
                />
              </div>

              <div className="large-card bg-[#212121] rounded-lg p-4 min-h-[30vh] flex flex-col justify-between shadow-md">
                {/* Header and Dropdown Row */}
                <div className="flex justify-between items-center mb-4">
                  {/* Heading */}
                  <h2 className="text-xl font-medium text-[#C1C4C8]">
                    Outstanding Balance
                  </h2>

                  {/* Dropdown */}
                  <select className="rounded-full border p-2 text-sm bg-gray-400 shadow-sm focus:outline-none hover:bg-gray-300 focus:ring-0">
                    <option value="vehicle">Vehicle</option>
                    <option value="home">Home</option>
                    <option value="personal">Personal</option>
                    <option value="marriage">Marriage</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="text-4xl text-[#FFFFFF] font-semibold mb-2 flex-grow">
                  <span className="text-[#8B8B8B] text-3xl mr-1">$</span>4000
                  <span className="text-3xl text-[#8B8B8B]">.00</span>
                </div>

                {/* Small Green Text with TrendingUp Icon */}
                <div className="flex items-center text-[#DAFF7C] text-sm mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" /> {/* Icon */}
                  <span>2.5% v last month</span> {/* Text */}
                </div>

                {/* Progress Bar with text inside */}
                <div className="relative w-full bg-gray-400 rounded-xl h-8 mb-4 flex-grow">
                  <div
                    className="bg-[#8C7BF3] text-black h-full rounded-xl"
                    style={{ width: "76%" }}
                  ></div>
                  {/* Progress Text */}
                  <div className="absolute inset-0 flex items-center justify-center text-black font-semibold">
                    76%
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/10 bg-[#212121] rounded-lg flex flex-col justify-between pt-4">
              <div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-[#C1C4C8] mb-8">
                    Remaining Balance
                  </p>
                  <div className="text-5xl text-[#FFFFFF] font-semibold mb-2 flex-grow">
                    <span className="text-[#8B8B8B] text-3xl mr-1">$</span>4000
                    <span className="text-3xl text-[#8B8B8B]">.00</span>
                  </div>
                  {/* Center the icon and text */}
                  <div className="flex justify-center items-center text-red-400 text-sm mb-4">
                    <TrendingDown className="w-4 h-4 mr-2" /> {/* Icon */}
                    <span>2.5% v last month</span> {/* Text */}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={data}>
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#8884d8"
                      fill="#8C7BF3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="emi-calculator bg-[#212121] rounded-lg p-4 w-[100%] mx-auto">
          <h2 className="text-xl font-medium text-[#C1C4C8] mb-8">
                     EMI Calculator
                  </h2>
            <div className="flex flex-col gap-4 mb-6">
              {/* Amount Slider */}
              <div className="flex items-center justify-between">
                <label className="text-lg text-gray-200">Amount</label>
                <span className="text-2xl font-semibold text-[#C3FC7F]">
                  ${formData.amount}
                </span>
              </div>
              <Slider
  value={formData.amount}
  min={1000}
  max={1000000}
  step={100}
  onChange={handleSliderChange}
  name="amount"
  valueLabelDisplay="auto"
  valueLabelFormat={(value) => `$${value}`}
  sx={{
    '& .MuiSlider-thumb': {
      backgroundColor: '#fff', // Change the thumb color
    },
    '& .MuiSlider-rail': {
      backgroundColor: '#ccc', // Change the rail color
      height: 10,
    },
    '& .MuiSlider-track': {
      backgroundColor: '#8C7BF3',
      height: 10, // Change the track color
    },
  }}
/>

              {/* Duration Slider */}
              <div className="flex items-center justify-between">
                <label className="text-lg text-gray-200">
                  Duration (Years)
                </label>
                <span className="text-2xl font-semibold text-[#C3FC7F]">
                  {formData.duration} Years
                </span>
              </div>
              <Slider
                value={formData.duration}
                min={1}
                max={20}
                step={1}
                onChange={handleSliderChange}
                name="duration"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} yrs`}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#fff', // Change the thumb color
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ccc', // Change the rail color
                    height: 10,
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#8C7BF3',
                    height: 10, // Change the track color
                  },
                }}
              />

              {/* ROI Slider */}
              <div className="flex items-center justify-between">
                <label className="text-lg text-gray-200">ROI (%)</label>
                <span className="text-2xl font-semibold text-[#C3FC7F]">{formData.roi}%</span>
              </div>
              <Slider
                value={formData.roi}
                min={1}
                max={20}
                step={0.1}
                onChange={handleSliderChange}
                name="roi"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#fff', // Change the thumb color
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ccc', // Change the rail color
                    height: 10,
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#8C7BF3',
                    height: 10, // Change the track color
                  },
                }}
              />

              {/* Calculate Button */}
              <div className="mt-6">
                <button
                  onClick={calculateEMI}
                  className="w-full py-3 border-2 cursor-pointer bg-[#8d7bf369] border-[#8C7BF3] text-white rounded-lg hover:bg-[#8d7bf38c]"
                >
                  Calculate
                </button>
              </div>
            </div>

            {/* EMI Details */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-gray-100 mb-4">
                EMI Details
              </h3>
              <p className="text-2xl text-[#eaffd1] font-semibold mb-2">
                <span className="text-[#C1C4C8] text-lg font-normal">Monthly EMI:</span> ${emiData.monthlyEmi}
              </p>
              <p className="text-2xl text-[#eaffd1] font-semibold mb-2">
                <span className="text-[#C1C4C8] text-lg font-normal">Principal Amount:</span> ${emiData.principalAmount}
              </p>
              <p className="text-3xl text-[#ffffff] font-semibold mb-2">
                <span className="text-[#C1C4C8] text-xl font-normal">Total Interest:</span> ${emiData.totalInterest}
              </p>
            </div>
          </div>
        </div>
        <div className="sidebar-content w-3/10 pl-4 ">
        <div className="upcoming-transactions bg-white rounded-t-lg gap-4 min-h-[40vh] relative">
  {/* Credit Card Image */}
  <div className="relative mb-6">
    <img 
      src="components/Images/creditCard.png" 
      alt="Credit Card" 
      className="w-full h-48 object-center rounded-t-lg" 
    />
    {/* Text on top of the Credit Card */}
    <div className="absolute top-14 left-24 text-white">
      <p className="font-semibold mb-3 text-2xl">John Doe</p>  {/* Cardholder's name */}
      <p className="text-md">1234 XXXX XXXX XXX2</p>  {/* Account Number */}
    </div>
  </div>
<div>
<h2 className="text-xl font-semibold">Upcoming Transactions</h2>
  <ul>
    <li className="text-lg text-gray-700 mb-2">
      <input type="checkbox" className="mr-2" />
      Car Loan: $1200 - 12/01/24
    </li>
    <li className="text-lg text-gray-700 mb-0">
      <input type="checkbox" className="mr-2 " />
      Home Loan: $9500 - 12/01/24
    </li>
  </ul>
</div>
  
</div>

          <div className="recent-transactions bg-white rounded-b-lg p-4 min-h-[60vh] h-full">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index} className="text-lg text-gray-700 mb-2">
                  {transaction.expenditureType}: ${transaction.amount} -{" "}
                  {transaction.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

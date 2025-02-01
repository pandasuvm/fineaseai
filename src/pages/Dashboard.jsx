import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firebase instance
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Slider } from "@mui/material"; // For the sliders (Amount, Duration, ROI)
import { format } from "date-fns"; // For formatting dates
import Loader from "../components/LoaderPage"; // Import the Loader component
import GradientText from "../components/GradientText";
import { TrendingUp, TrendingDown, House, Car, User, Users } from "lucide-react";
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

const loanData = [
  {
    type: 'home',
    amount: 1200,
    date: '12-01-2024',
  },
  {
    type: 'vehicle',
    amount: 9500,
    date: '12-01-2024',
  },
  {
    type: 'personal',
    amount: 5000,
    date: '15-02-2024',
  },
  {
    type: 'marriage',
    amount: 7000,
    date: '20-03-2024',
  },
];

// Function to map loan type to respective icon
const getLoanIcon = (type) => {
  switch (type) {
    case 'home':
      return <House className="w-6 h-6 text-[#AEAEAE]" />;
    case 'vehicle':
      return <Car className="w-6 h-6 text-[#AEAEAE]" />;
    case 'personal':
      return <User className="w-6 h-6 text-[#AEAEAE]" />;
    case 'marriage':
      return <Users className="w-6 h-6 text-[#AEAEAE]" />;
    default:
      return null;
  }
};

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
    <div className="dashboard-container p-4 pl-7 bg-black">
      {loading && <Loader />} {/* Show loader if loading is true */}
      <div className="flex">
        <div className="main-content w-7/10 pr-4">
          <div className="welcome-message mb-4">
            <h1 className="text-xl font-semibold text-gray-400 font-wide ml-8">
              Welcome back {user ? user.displayName : "User"}
            </h1>
            {/* <p className="text-gray-600 mt-2">AI LOAN RECOMMENDER</p> */}
          </div>
          <div className="flex mb-7 gap-7">
            <div className="w-[60%] flex flex-col gap-4">
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
                  <h2 className="text-xl font-medium text-[#C1C4C8] font-wide">
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
                <div className="text-3xl text-[#FFFFFF] font-semibold mb-2 flex-grow font-wide">
                  <span className="text-[#8B8B8B] text-xl mr-1">$</span>4000
                  <span className="text-xl text-[#8B8B8B]">.00</span>
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
            <div className="w-[40%] bg-[#212121] rounded-lg flex flex-col justify-between pt-4">
              <div>
                <div className="text-center">
                  <p className="text-xl font-medium text-[#C1C4C8] font-wide mb-8">
                    Remaining Balance
                  </p>
                  <div className="text-4xl text-[#FFFFFF] font-semibold mb-2 flex-grow font-wide">
                    <span className="text-[#8B8B8B] text-2xl mr-1">$</span>4000
                    <span className="text-2xl text-[#8B8B8B]">.00</span>
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
          <div className="emi-calculator bg-[#212121] rounded-lg p-4 w-[100%] mx-auto flex gap-8">
  {/* EMI Calculator (Left Side) */}
  <div className="flex-1">
    <h2 className="text-xl font-medium text-[#C1C4C8] mb-8 font-wide">
      EMI Calculator
    </h2>
    <div className="flex flex-col gap-4 mb-6">
      {/* Amount Slider */}
      <div className="flex items-center justify-between font-wide">
        <label className="text-md text-gray-200">Amount</label>
        <span className="text-xl font-semibold text-[#C3FC7F]">
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
            backgroundColor: '#fff',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#ccc',
            height: 10,
          },
          '& .MuiSlider-track': {
            backgroundColor: '#8C7BF3',
            height: 10,
          },
        }}
      />

      {/* Duration Slider */}
      <div className="flex items-center font-wide justify-between">
        <label className="text-md text-gray-200">
          Duration (Years)
        </label>
        <span className="text-xl font-semibold text-[#C3FC7F]">
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
            backgroundColor: '#fff',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#ccc',
            height: 10,
          },
          '& .MuiSlider-track': {
            backgroundColor: '#8C7BF3',
            height: 10,
          },
        }}
      />

      {/* ROI Slider */}
      <div className="flex items-center font-wide justify-between">
        <label className="text-md text-gray-200">ROI (%)</label>
        <span className="text-xl font-semibold text-[#C3FC7F]">{formData.roi}%</span>
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
            backgroundColor: '#fff',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#ccc',
            height: 10,
          },
          '& .MuiSlider-track': {
            backgroundColor: '#8C7BF3',
            height: 10,
          },
        }}
      />

      {/* Calculate Button */}
      {/* <div className="mt-6">
        <button
          onClick={calculateEMI}
          className="w-full py-3 border-2 cursor-pointer bg-[#8d7bf369] border-[#8C7BF3] text-white rounded-lg hover:bg-[#8d7bf38c]"
        >
          Calculate
        </button>
      </div> */}
    </div>
  </div>

  {/* EMI Details (Right Side) */}
  <div className="flex-1 bg-[#1d1d1d] rounded-lg p-4">
    <h3 className="text-2xl font-semibold text-gray-100 mb-4 text-center font-wide">
      EMI Details
    </h3>
    <div className="text-center gap-6">
      <p className="text-xl font-wide text-[#eaffd1] font-normal mb-4">
        <span className="text-[#C1C4C8] text-base font-normal">Monthly EMI:</span> ${emiData.monthlyEmi}
      </p>
      <p className="text-xl font-wide text-[#eaffd1] font-normal mb-4">
        <span className="text-[#C1C4C8] text-base font-normal">Principal Amount:</span> ${emiData.principalAmount}
      </p>
      <p className="text-xl font-wide text-[#eaffd1] font-normal mb-4">
        <span className="text-[#C1C4C8] text-base font-normal">Total Interest:</span> ${emiData.totalInterest}
      </p>
    </div>
  </div>
</div>

        </div>
        <div className="sidebar-content w-3/10 pl-4 ">
        <div className="upcoming-transactions bg-black rounded-t-lg gap-4 min-h-[40vh] relative mb-5">
  {/* Credit Card Image */}
  <div className="relative mb-6">
    <h2 className="text-xl font-semibold text-white font-wide ml-1 mb-5 mt-5">My Cards</h2>
    <img 
      src="components/Images/creditCard.png" 
      alt="Credit Card" 
      className="w-full h-48 object-center rounded-t-lg" 
    />
    {/* Text on top of the Credit Card */}
    <div className="absolute top-24 left-24 text-white">
      <p className="font-semibold mb-3 text-2xl font-wide">John Doe</p>  {/* Cardholder's name */}
      <p className="text-sm font-wider">1234 XXXX XXXX XXX2</p>  {/* Account Number */}
    </div>
  </div>

  <div className="mr-3 pb-2">
      <h2 className="text-xl font-semibold text-white mb-5 font-wide">Upcoming Payments</h2>
      <ul>
        {loanData.map((loan, index) => (
          <li key={index} className="flex items-center mb-4 text-lg">
            {/* Loan Icon */}
            <div className="mr-4 flex-shrink-0">
              {getLoanIcon(loan.type)}
            </div>

            {/* Loan Details */}
            <div className="flex-1">
              {/* First Line: Loan Name (with "Loan" suffix) and Amount on opposite sides */}
              <div className="flex justify-between font-normal text-[#AEAEAE]">
                <span className="mb-1">{loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan</span>
                <span className="text-[#e2e2e2] font-wide text-sm font-normal">${loan.amount}</span>
              </div>

              {/* Second Line: Loan Date */}
              <div className="text-xs text-gray-500 font-wide">{loan.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  
</div>

<div className="recent-transactions bg-black rounded-b-lg p-4 max-h-[70vh] min-h-[50vh] border-t-1  border-gray-600">
  <h2 className="text-xl font-semibold text-white mb-5 font-wide mt-3">Recent Transactions</h2>
  <ul>
    {transactions.map((transaction, index) => (
      <li key={index} className="text-lg text-gray-700 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-normal text-xl mb-2 text-[#AEAEAE]">{transaction.expenditureType}</span>
          <span className="ml-4 text-red-200 font-wide text-sm font-normal">${transaction.amount}</span>
        </div>
        <div className="text-xs text-gray-500 font-wide">{transaction.date}</div>
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

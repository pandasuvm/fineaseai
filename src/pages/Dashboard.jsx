import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import Firebase instance
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Slider } from "@mui/material"; // For the sliders (Amount, Duration, ROI)
import { format } from "date-fns"; // For formatting dates
import Loader from "../components/LoaderPage"; // Import the Loader component

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
      const q = query(collection(db, "expenses"), where("userId", "==", userId));
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
    <div className="p-6 bg-[#F7F6F9] relative">
      {loading && <Loader />} {/* Show loader if loading is true */}

      {/* Top Section: Welcome Message and Remaining Balance */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back {user ? user.displayName : "User"}</h1>
          <p className="text-gray-600 mt-2">AI LOAN RECOMMENDER</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-800">Remaining Balance</p>
          <p className="text-2xl font-bold text-green-600">$4400</p>
          <p className="text-md text-gray-500">34% saving</p>
        </div>
      </div>

      {/* Main Content: EMI Calculator and Recent Transactions */}
      <div className="flex gap-10">
        {/* Left Section: EMI Calculator (Smaller) */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-[45%]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">EMI Calculator</h2>
          <div className="flex flex-col gap-4 mb-6">
            {/* Amount Slider */}
            <div className="flex items-center justify-between">
              <label className="text-lg text-gray-700">Amount</label>
              <span className="text-lg text-gray-700">${formData.amount}</span>
            </div>
            <Slider
              value={formData.amount}
              min={1000}
              max={100000}
              step={100}
              onChange={handleSliderChange}
              name="amount"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
            />

            {/* Duration Slider */}
            <div className="flex items-center justify-between">
              <label className="text-lg text-gray-700">Duration (Years)</label>
              <span className="text-lg text-gray-700">{formData.duration} Years</span>
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
            />

            {/* ROI Slider */}
            <div className="flex items-center justify-between">
              <label className="text-lg text-gray-700">ROI (%)</label>
              <span className="text-lg text-gray-700">{formData.roi}%</span>
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
            />

            {/* Calculate Button */}
            <div className="mt-6">
              <button
                onClick={calculateEMI}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Calculate
              </button>
            </div>
          </div>

          {/* EMI Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">EMI Details</h3>
            <p className="text-md text-gray-700">Monthly EMI: ${emiData.monthlyEmi}</p>
            <p className="text-md text-gray-700">Principal Amount: ${emiData.principalAmount}</p>
            <p className="text-md text-gray-700">Total Interest: ${emiData.totalInterest}</p>
          </div>
        </div>

        {/* Right Section: Recent Transactions and Upcoming Payments */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-[45%]">
          {/* Upcoming Payments */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Payments</h2>
            <ul>
              <li className="text-lg text-gray-700 mb-2">
                <input type="checkbox" className="mr-2" />
                Car Loan: $1200 - 12/01/24
              </li>
              <li className="text-lg text-gray-700 mb-2">
                <input type="checkbox" className="mr-2" />
                Home Loan: $9500 - 12/01/24
              </li>
            </ul>
          </div>

          {/* Recent Transactions */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index} className="text-lg text-gray-700 mb-2">
                  {transaction.expenditureType}: ${transaction.amount} - {transaction.date}
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

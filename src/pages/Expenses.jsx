import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const expenses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    expenditureType: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for authentication changes
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
      fetchExpenses(user.uid);
    }
  }, [user]);

  const fetchExpenses = async (userId) => {
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedExpenses = querySnapshot.docs.map((doc) => doc.data());
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.expenditureType) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      // Store the expense data in Firestore
      await addDoc(collection(db, "expenses"), {
        amount: formData.amount,
        date: formData.date,
        expenditureType: formData.expenditureType,
        userId: user.uid,
      });

      // Clear the form and refresh the list of expenses
      setFormData({ amount: "", date: "", expenditureType: "" });
      fetchExpenses(user.uid);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add Expenses</h1>
        <p className="text-gray-600 mt-2">Track your expenses efficiently and stay on top of your finances.</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Expense Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700 mb-2">Expenditure Type</label>
              <input
                type="text"
                name="expenditureType"
                placeholder="Enter Expenditure Type"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.expenditureType}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* Expenses Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Expenses</h2>
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-6 text-left text-lg font-medium text-gray-700">S.No</th>
              <th className="py-3 px-6 text-left text-lg font-medium text-gray-700">Expense Name</th>
              <th className="py-3 px-6 text-left text-lg font-medium text-gray-700">Date</th>
              <th className="py-3 px-6 text-left text-lg font-medium text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-6 text-gray-800">{index + 1}</td>
                <td className="py-3 px-6 text-gray-800">{expense.expenditureType}</td>
                <td className="py-3 px-6 text-gray-800">{expense.date}</td>
                <td className="py-3 px-6 text-gray-800">${expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Expenses */}
      <div className="mt-6 bg-indigo-100 p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800">Last Month's Total Expense</h3>
        <p className="text-2xl font-bold text-indigo-600">${totalExpense}</p>
      </div>
    </div>
  );
};

export default expenses;

import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Confirmation prompt library
import "react-confirm-alert/src/react-confirm-alert.css"; // Styles for confirmation prompt
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import {FaTrashAlt } from 'react-icons/fa'; 
import { Plus } from 'lucide-react';

const Expenses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    expenditureType: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const expensesPerPage = 5; // Number of expenses per page

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
      fetchExpenses(user.uid);
    }
  }, [user]);

  const fetchExpenses = async (userId) => {
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedExpenses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  const handleDeleteExpense = (expenseId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this expense?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "expenses", expenseId));
              fetchExpenses(user.uid); // Refresh the list after deletion
              toast.success("Expense deleted successfully!");
            } catch (error) {
              console.error("Error deleting expense:", error);
              toast.error("Error deleting expense.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info("Expense deletion cancelled")
        }
      ]
    });
  };

  // Pagination logic
  const indexOfLastExpense = (currentPage + 1) * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = expenses.slice(indexOfFirstExpense, indexOfLastExpense);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6 bg-black">
      <div className="mb-8 flex justify-between">
        <h1 className="text-3xl font-bold text-white font-wide">Add Expenses</h1>
        <div className="flex flex-col items-end">
          <h3 className="text-xl font-medium text-gray-400 font-wide">Last Month's Total Expense</h3>
          <p className="text-4xl font-semibold font-wide mt-3 text-[#C4FC82]">${totalExpense}</p>
        </div>
      </div>

      <div className="bg-white/10 border border-[#5b5b5b] backdrop-blur-lg shadow-lg rounded-lg p-6">
  {/* Expense Form */}
  <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="flex flex-col">
        <label className="text-lg font-medium text-gray-400 font-wide mb-2">Amount</label>
        <input
          type="number"
          name="amount"
          placeholder="Enter Amount"
          className="p-3 border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col">
  <label className="text-lg font-medium text-gray-400 font-wide mb-2">Date</label>
  <input
    type="date"
    name="date"
    className="p-3 font-wide border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 bg-[#212121] backdrop-blur-lg text-white"
    value={formData.date}
    onChange={handleChange}
    required
    style={{
      color: 'white',
    }}
  />
</div>

<style jsx>{`
  /* Webkit browsers (Chrome, Safari, Edge) */
  input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: #C4FC82; /* The calendar icon */
    color: white; /* Icon color */
    border-radius:3px;
  }

  /* Optional: styling the text box */
  input[type="date"] {
    color: white; /* Date text */
  }
`}</style>

      <div className="flex flex-col">
        <label className="text-lg font-medium text-gray-400 font-wide mb-2">Expenditure Type</label>
        <input
          type="text"
          name="expenditureType"
          placeholder="Enter Expenditure Type"
          className="p-3 border-2 font-wide border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 bg-[#212121] backdrop-blur-lg text-white"
          value={formData.expenditureType}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="flex justify-end">
    <button
  type="submit"
  className="px-6 py-3 bg-[#8C7BF3] text-white rounded-full font-wide hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
  disabled={loading}
>
  {loading ? "Submitting..." : "Add Expense"}
  <Plus className="w-5 h-5 ml-1 font-bold" /> {/* Plus icon with size and margin */}
</button>
    </div>
  </form>
</div>



      {/* Expenses Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-300 font-wide mb-4">Your Expenses</h2>
        <table className="min-w-full table-auto bg-white/10 backdrop-blur-lg shadow-2xl border border-gray-600 font-wide">
  <thead>
  <tr className="bg-white/10 backdrop-blur-lg font-bold bg-opacity-50 border border-gray-400 ">

      <th className="py-3 px-6 text-left text-lg font-medium text-gray-300">S.No</th>
      <th className="py-3 px-6 text-left text-lg font-medium text-gray-300">Expense Name</th>
      <th className="py-3 px-6 text-left text-lg font-medium text-gray-300">Date</th>
      <th className="py-3 px-6 text-left text-lg font-medium text-gray-300">Amount</th>
      <th className="py-3 px-6 text-left text-lg font-medium text-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentExpenses.map((expense, index) => (
      <tr
        key={index}
        className="border-b border-gray-500 rounded-2xl bg-transparent backdrop-blur-lg hover:bg-gray-900 hover:bg-opacity-90 transition-all"
      >
        <td className="py-3 px-6 text-gray-100">{index + 1}</td>
        <td className="py-3 px-6 text-gray-100">{expense.expenditureType}</td>
        <td className="py-3 px-6 text-gray-100">{expense.date}</td>
        <td className="py-3 px-6 text-gray-100">${expense.amount}</td>
        <td className="py-3 px-6 text-gray-100">
          <button
            onClick={() => handleDeleteExpense(expense.id)}
            className="bg-[#8C7BF3] text-white text-sm p-3 rounded-full hover:bg-red-400"
          >
            <FaTrashAlt />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(expenses.length / expensesPerPage)}
            variant="outlined"
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Expenses;

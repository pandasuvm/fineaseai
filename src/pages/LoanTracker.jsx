import React, { useState, useEffect } from 'react';
import { FaTimesCircle, FaPlusCircle, FaTrashAlt } from 'react-icons/fa'; // React Icons for actions
import { ToastContainer, toast } from 'react-toastify'; // Notification library
import Pagination from '@mui/material/Pagination'; // MUI Pagination
import Stack from '@mui/material/Stack'; // MUI Stack
import TextField from '@mui/material/TextField'; // MUI TextField
import DatePicker from 'react-datepicker'; // Normal datepicker
import { confirmAlert } from 'react-confirm-alert'; // Confirmation prompt
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import 'react-confirm-alert/src/react-confirm-alert.css'; // Confirmation prompt styles
import { db ,auth} from '../firebase'; // Adjust the import path based on your file structure

// Import Firestore methods
import { collection, addDoc, getDocs, query, where, deleteDoc, doc,setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth import
import { useNavigate } from 'react-router-dom'; // Redirect to login if user is not authenticated

const LoanTracker = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // User state to hold the logged-in user
  const [loanData, setLoanData] = useState([]);
  const [loanDetails, setLoanDetails] = useState({
    name: '',
    amount: '',
    interest: '',
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const loansPerPage = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        navigate("/login");
      } else {
        fetchLoans(user.uid); // Fetch loans for the logged-in user
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch loans from Firestore
  const fetchLoans = async (userId) => {
    try {
      const loanQuery = query(collection(db, "loans"), where("userId", "==", userId));
      const querySnapshot = await getDocs(loanQuery);
      const fetchedLoans = querySnapshot.docs.map(doc => {
        const loan = doc.data();
        return {
          id: doc.id,
          name: loan.name,
          amount: loan.amount,
          interest: loan.interest,
          startDate: loan.startDate ? loan.startDate.toDate() : null,
          endDate: loan.endDate ? loan.endDate.toDate() : null,
          emi: loan.emi,
          remainingAmount: loan.remainingAmount,
          durationInMonths: loan.durationInMonths,
          emiPaid: loan.emiPaid,
          paidEmis: loan.paidEmis,
        };
      });
      setLoanData(fetchedLoans);
    } catch (error) {
      toast.error("Error fetching loans: " + error.message);
    }
  };

  // Add a new loan to Firestore
  const addLoan = async () => {
    const { name, amount, interest, startDate, endDate } = loanDetails;
  
    if (!name || !amount || !interest || !startDate || !endDate) {
      toast.error("All fields must be filled!");
      return;
    }

    const { emi, remainingAmount, durationInMonths } = calculateLoanDetails(amount, interest, startDate, endDate);

    if (emi === 0 || remainingAmount === 0 || isNaN(emi) || isNaN(remainingAmount)) {
      toast.error("Invalid loan details!");
      return;
    }

    const newLoan = {
      userId: user.uid, // Add the userId here
      name,
      amount: parseFloat(amount),
      interest: parseFloat(interest),
      startDate,
      endDate,
      emi,
      remainingAmount,
      durationInMonths,
      emiPaid: 0,
      paidEmis: [],
    };
  
    try {
      const docRef = await addDoc(collection(db, "loans"), newLoan);
      setLoanData([...loanData, { id: docRef.id, ...newLoan }]);
      setLoanDetails({ name: '', amount: '', interest: '', startDate: null, endDate: null });
      toast.success("Loan added successfully!");
    } catch (error) {
      toast.error("Error adding loan: " + error.message);
    }
  };

  // Function to calculate EMI and remaining amount
  const calculateLoanDetails = (amount, interest, startDate, endDate) => {
    const principal = parseFloat(amount);
    const rate = parseFloat(interest) / 100;
    
    if (!principal || !rate || !startDate || !endDate) {
      return { emi: 0, remainingAmount: 0, durationInMonths: 0 };
    }
    
    // Calculate months between start and end date
    const durationInMonths = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
  
    const emi = (principal * rate) / (1 - Math.pow(1 + rate, -durationInMonths));
    const totalAmount = emi * durationInMonths;
    const remainingAmount = totalAmount; // Start with full amount
    
    return { emi, remainingAmount, durationInMonths };
  };

  // Delete a loan with confirmation
  const deleteLoan = (index) => {
    const loanToDelete = loanData[index];

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this loan?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "loans", loanToDelete.id)); // Delete loan from Firestore
              const newLoanData = loanData.filter((_, i) => i !== index);
              setLoanData(newLoanData);
              toast.success("Loan deleted successfully!");
            } catch (error) {
              toast.error("Error deleting loan: " + error.message);
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info("Loan deletion cancelled")
        }
      ]
    });
  };

  // Pagination logic
  const indexOfLastLoan = (currentPage + 1) * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loanData.slice(indexOfFirstLoan, indexOfLastLoan);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };


  return (
    <div className="min-h-screen w-full p-6 bg-white">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Loan Tracker</h1>

      {/* Loan Form (Top Section) */}
      <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Loan</h2>
        <div className="grid grid-cols-2 gap-4">
        <select
  name="name"
  value={loanDetails.name}
  onChange={(e) => setLoanDetails({ ...loanDetails, name: e.target.value })}
  className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg"
>
  <option value="" disabled>Select Loan Type</option>
  <option value="Home Loan">Home Loan</option>
  <option value="Vehicle Loan">Vehicle Loan</option>
  <option value="Car Loan">Car Loan</option>
  <option value="Marriage Loan">Marriage Loan</option>
  <option value="Personal Loan">Personal Loan</option>
</select>

          <input
            type="number"
            name="amount"
            placeholder="Loan Amount"
            value={loanDetails.amount}
            onChange={(e) => setLoanDetails({ ...loanDetails, amount: e.target.value })}
            className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg"
          />
          <input
            type="number"
            name="interest"
            placeholder="Interest Rate (%)"
            value={loanDetails.interest}
            onChange={(e) => setLoanDetails({ ...loanDetails, interest: e.target.value })}
            className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-800">Start Date</label>
          <DatePicker
            selected={loanDetails.startDate}
            onChange={(date) => setLoanDetails({ ...loanDetails, startDate: date })}
            dateFormat="MM/dd/yyyy"
            className="w-full p-3 mt-2 bg-gray-200 text-gray-800 rounded-lg"
          />
        </div>

        <div className="mt-4">
          <label className="text-gray-800">End Date</label>
          <DatePicker
            selected={loanDetails.endDate}
            onChange={(date) => setLoanDetails({ ...loanDetails, endDate: date })}
            dateFormat="MM/dd/yyyy"
            className="w-full p-3 mt-2 bg-gray-200 text-gray-800 rounded-lg"
          />
        </div>

        <button
          onClick={addLoan}
          className="w-full p-3 mt-6 bg-purple-600 text-white rounded-lg"
        >
          <FaPlusCircle className="inline mr-2" /> Add Loan
        </button>
      </div>

      {/* Loans List (Below Form) */}
      <div className="mt-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Loans</h2>
        <div className="overflow-x-auto bg-gray-100 rounded-lg shadow-lg">
          <table className="w-full table-auto text-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 text-left">Loan Name</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Interest Rate</th>
                <th className="p-4 text-left">Start Date</th>
                <th className="p-4 text-left">End Date</th>
                <th className="p-4 text-left">EMI Amount</th>
                <th className="p-4 text-left">Remaining Amount</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
  {currentLoans.map((loan, index) => (
    <tr key={index} className="bg-gray-50 hover:bg-gray-200">
      <td className="p-4">{loan.name}</td>
      <td className="p-4">${loan.amount}</td>
      <td className="p-4">{loan.interest}%</td>
      <td className="p-4">{new Date(loan.startDate).toLocaleDateString()}</td>
      <td className="p-4">{new Date(loan.endDate).toLocaleDateString()}</td>
      <td className="p-4">${loan.emi ? loan.emi.toFixed(2) : 'N/A'}</td>
      <td className="p-4">${loan.remainingAmount ? loan.remainingAmount.toFixed(2) : 'N/A'}</td>
      <td className="p-4">
        <button
          onClick={() => updateEmiPaid(index)}
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-400"
        >
          + EMI Paid
        </button>
        <button
          onClick={() => deleteLoan(index)}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 ml-2"
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
              count={Math.ceil(loanData.length / loansPerPage)}
              variant="outlined"
              onChange={handlePageChange}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default LoanTracker;

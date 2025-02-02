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
import { Plus } from 'lucide-react';

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
    <div className="min-h-screen w-full p-6 bg-black font-wide">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-semibold text-gray-300 font-wide mb-4 text-center">Loan Tracker</h1>

      {/* Loan Form (Top Section) */}
      <div className="bg-white/10 border border-[#5b5b5b] backdrop-blur-lg shadow-lg rounded-lg p-6 max-w-3xl m-auto">
  <h2 className="text-2xl font-semibold text-gray-300 mb-4">Add New Loan</h2>

  {/* First Row: Loan Amount and Interest Rate */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <input
      type="number"
      name="amount"
      placeholder="Loan Amount"
      value={loanDetails.amount}
      onChange={(e) => setLoanDetails({ ...loanDetails, amount: e.target.value })}
      className="p-3 border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
    />
    <input
      type="number"
      name="interest"
      placeholder="Interest Rate (%)"
      value={loanDetails.interest}
      onChange={(e) => setLoanDetails({ ...loanDetails, interest: e.target.value })}
      className="p-3 border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
    />
  </div>

  {/* Second Row: Start Date and End Date */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div>
      <label className="text-gray-300 block mb-2">Start Date</label>
      <DatePicker
        selected={loanDetails.startDate}
        onChange={(date) => setLoanDetails({ ...loanDetails, startDate: date })}
        dateFormat="MM/dd/yyyy"
        className="w-[170%] p-3 border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
      />
    </div>
    <div>
      <label className="text-gray-300 block mb-2">End Date</label>
      <DatePicker
        selected={loanDetails.endDate}
        onChange={(date) => setLoanDetails({ ...loanDetails, endDate: date })}
        dateFormat="MM/dd/yyyy"
        className="w-[170%] p-3 border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] rounded-lg focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
      />
    </div>
  </div>

  {/* Loan Type Selection - Tags */}
  <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
  {["Home Loan", "Vehicle Loan", "Car Loan", "Marriage Loan", "Personal Loan"].map((loanType) => (
    <button
      key={loanType}
      onClick={() => setLoanDetails({ ...loanDetails, name: loanType })}
      className={`w-full p-2 pr-1 pl-1 text-[#b6b6b6] rounded-full border-2 border-[#5b5b5b] transition-all duration-300 
        ${loanDetails.name === loanType ? 'bg-[#C4FC82] text-black font-semibold border-[#C4FC82]' : 'bg-transparent border-[#5b5b5b] hover:bg-[#5b5b5b49]'}`}
    >
      {loanType}
    </button>
  ))}
</div>


<div className="flex justify-end">
  {/* Submit Button */}
  <button
    onClick={addLoan}
    className="p-3 pt-2 w-[220px] pb-2 mt-6 bg-[#8C7BF3] text-white rounded-3xl"
  >
    Add Loan <Plus className="inline ml-1 h-5 w-5" />
  </button>
</div>

</div>




      {/* Loans List (Below Form) */}
      <div className="mt-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Your Loans</h2>
        <div className="overflow-x-auto bg-[#2E3131] shadow-lg">
        <table className="min-w-full table-auto bg-white/10 backdrop-blur-lg shadow-2xl border border-gray-600 font-wide">
  <thead>
    <tr className="bg-white/10 backdrop-blur-lg font-bold bg-opacity-50 border border-gray-400 text-gray-2000 text-sm">
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">Loan Name</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">Amount</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">Interest Rate</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">Start Date</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">End Date</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">EMI Amount</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300">Remaining Amount</th>
      <th className="py-3 px-6 text-left text-md font-medium text-gray-300 w-[200px]">Actions</th> {/* Increased width here */}
    </tr>
  </thead>
  <tbody>
    {currentLoans.map((loan, index) => (
      <tr key={index} className="bg-[#191A1A] text-white text-sm border-b border-gray-500 backdrop-blur-lg hover:bg-gray-900 hover:bg-opacity-90 transition-all">
        <td className="pr-2 pl-2 pt-3 pb-3">{loan.name}</td>
        <td className="p-4 pr-0">${loan.amount}</td>
        <td className="p-4 pr-0">{loan.interest}%</td>
        <td className="p-4 pr-0">{new Date(loan.startDate).toLocaleDateString()}</td>
        <td className="p-4 pr-0">{new Date(loan.endDate).toLocaleDateString()}</td>
        <td className="p-4 pr-0">${loan.emi ? loan.emi.toFixed(2) : 'N/A'}</td>
        <td className="p-4 pr-0">${loan.remainingAmount ? loan.remainingAmount.toFixed(2) : 'N/A'}</td>
        <td className="p-4">
          <button
            onClick={() => updateEmiPaid(index)}
            className="bg-[#C4FC82] text-black p-2 pr-3 pl-3 text-xs font-semibold rounded-full hover:bg-[#9ad05b] cursor-pointer"
          >
            + EMI Paid
          </button>
          <button
            onClick={() => deleteLoan(index)}
            className="bg-[#8C7BF3] text-white p-3 cursor-pointer text-sm rounded-full hover:bg-red-400 ml-2"
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

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import auth for user data
import { collection, getDocs, query, where } from "firebase/firestore";
import { TrendingUp } from "lucide-react";

const OutstandingBalanceCard = () => {
  const [selectedLoanName, setSelectedLoanName] = useState("Home Loan");
  const [loanData, setLoanData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the logged-in user's ID
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  useEffect(() => {
    if (selectedLoanName && userId) {
      fetchLoanData(selectedLoanName, userId);
    }
  }, [selectedLoanName, userId]);

  // Fetch loan data from Firestore based on the loan name and user ID
  const fetchLoanData = async (loanName, userId) => {
    if (!loanName || !userId) return; // Ensure both loanName and userId exist before querying

    try {
      const loansRef = collection(db, "loans");
      const q = query(loansRef, where("name", "==", loanName), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const loan = querySnapshot.docs[0].data();

        // Ensure paidEmis exists as an array and count its elements
        const emiPaidCount = loan?.paidEmis ? loan.paidEmis.length : 0;
        const duration = loan?.durationInMonths || 1; // Prevent division by zero
        const calculatedProgress = 100 - ((duration - emiPaidCount) / duration) * 100;

        setProgress2(((duration - emiPaidCount) / duration) * 100);
        setLoanData(loan);
        setProgress(calculatedProgress);
      } else {
        setLoanData(null);
        setProgress(0);
        setProgress2(0);
      }
    } catch (error) {
      console.error("Error fetching loan data: ", error);
      setLoanData(null);
      setProgress(0);
      setProgress2(0);
    }
  };

  // Handle dropdown selection change
  const handleDropdownChange = (e) => {
    setSelectedLoanName(e.target.value);
  };

  return (
    <div className="large-card bg-[#212121] rounded-lg p-4 min-h-[30vh] flex flex-col justify-between shadow-md w-[55%]">
      {/* Header and Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-[#C1C4C8]">Outstanding Balance</h2>
        <select
          className="rounded-full border p-2 text-sm bg-gray-400 shadow-sm focus:outline-none hover:bg-gray-300 focus:ring-0"
          value={selectedLoanName}
          onChange={handleDropdownChange}
        >
          <option value="Home Loan">Home Loan</option>
          <option value="Vehicle Loan">Vehicle Loan</option>
          <option value="Car Loan">Car Loan</option>
          <option value="Marriage Loan">Marriage Loan</option>
          <option value="Personal Loan">Personal Loan</option>
        </select>
      </div>

      {/* Amount Display */}
      <div className="text-4xl text-[#FFFFFF] font-semibold mb-2 flex-grow">
        {loanData ? (
          <>
            <span className="text-[#8B8B8B] text-3xl mr-1">$</span>
            {loanData.remainingAmount !== undefined ? loanData.remainingAmount.toFixed(2) : "N/A"}
            <span className="text-3xl text-[#8B8B8B]">.00</span>
          </>
        ) : (
          <span>0.00</span>
        )}
      </div>

      {/* Progress Percentage */}
      <div className="flex items-center text-[#DAFF7C] text-sm mb-4">
        <TrendingUp className="w-4 h-4 mr-2" />
        <span>{loanData ? `${Math.round(progress2)}% remaining` : "N/A"}</span>
      </div>

      {/* Loan Details */}
      <div className="text-[#C1C4C8] text-sm mb-4">
        <p>
          Interest Rate: <span className="font-semibold">{loanData?.interest ?? "N/A"}%</span>
        </p>
        <p>
          EMI:{" "}
          <span className="font-semibold">
            ${loanData?.emi !== undefined ? loanData.emi.toFixed(2) : "N/A"}
          </span>
        </p>

        <p>
          EMIs Paid: <span className="font-semibold">{loanData?.paidEmis ? loanData.paidEmis.length : "N/A"}</span>
        </p>

      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-400 rounded-xl h-8 flex-grow">
        <div
          className="bg-[#8C7BF3] text-black h-full rounded-xl"
          style={{ width: loanData ? `${progress}%` : "0%" }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-black font-semibold">
          {loanData ? `${Math.round(progress)}%` : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default OutstandingBalanceCard;

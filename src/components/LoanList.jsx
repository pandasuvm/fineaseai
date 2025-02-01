// LoanList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore instance

const LoanList = () => {
  const [loanData, setLoanData] = useState([]);

  // Fetch loan data from Firestore
  useEffect(() => {
    const fetchLoanData = async () => {
      const loanRef = collection(db, 'loans');
      const snapshot = await getDocs(loanRef);
      const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoanData(loans);
    };
    fetchLoanData();
  }, []);

  // Function to calculate the upcoming EMI date
  const calculateNextEmiDate = (startDate, emiPaid, durationInMonths) => {
    let currentDate = new Date(startDate.seconds * 1000);
    currentDate.setMonth(currentDate.getMonth() + emiPaid);
    if (emiPaid < durationInMonths) {
      return currentDate.toLocaleDateString();
    }
    return "All EMIs Paid";
  };

  // Render loan data
  return (
    <ul>
      {loanData.map((loan, index) => (
        <li key={index} className="flex items-center mb-4 text-lg">
          <div className="mr-4 flex-shrink-0">
            {/* Your Loan Icon rendering logic */}
          </div>

          <div className="flex-1">
            <div className="flex justify-between font-normal text-[#AEAEAE]">
              <span className="mb-1">{loan.name} Loan</span>
              <span className="text-[#e2e2e2] font-wide text-sm font-normal">${loan.amount}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-wide">
              <span>EMI: ${loan.emi.toFixed(2)}</span>
              <span>Next EMI: {calculateNextEmiDate(loan.startDate, loan.paidEmis.length, loan.durationInMonths)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LoanList;

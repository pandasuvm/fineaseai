import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from '../firebase'; // Import Firestore and Auth instance
import { onAuthStateChanged } from "firebase/auth"; // Import Auth

const LoanList = () => {
  const [loanData, setLoanData] = useState([]);
  const [user, setUser] = useState(null); // Store the logged-in user
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchLoanData(user.uid); // Fetch loans when the user is authenticated
    }
  }, [user]);

  // Fetch loan data specific to the logged-in user
  const fetchLoanData = async (userId) => {
    try {
      const loanRef = collection(db, "loans");
      const q = query(loanRef, where("userId", "==", userId)); // Filter by userId
      const snapshot = await getDocs(q);
      const loans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLoanData(loans);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

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
              <span className="mb-1">{loan.name}</span>
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

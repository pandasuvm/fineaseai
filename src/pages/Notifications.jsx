import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase configuration and initialization
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase'; // Firebase Authentication
import { ToastContainer, toast } from 'react-toastify'; // Notification library
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa'; // Import FaTimesCircle icon from react-icons

const Notifications = () => {
  const [userId, setUserId] = useState(null); // To store the logged-in user's ID
  const [loanData, setLoanData] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [passedEmis, setPassedEmis] = useState([]);
  const [otherNotifications, setOtherNotifications] = useState([]);

  useEffect(() => {
    // Get the logged-in user's ID from Firebase Authentication
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid); // Set the user ID
    }
  }, []);

  useEffect(() => {
    // Fetch the loan data when the component is mounted or userId changes
    if (userId) {
      fetchLoans();
    }
  }, [userId]);

  const fetchLoans = async () => {
    if (!userId) return; // Return early if no user ID

    try {
      const loansRef = collection(db, "loans");
      const q = query(loansRef, where("userId", "==", userId)); // Filter loans by userId
      const querySnapshot = await getDocs(q);
      const loans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLoanData(loans);
      categorizeNotifications(loans);
    } catch (error) {
      toast.error("Error fetching loans: " + error.message);
    }
  };

  const categorizeNotifications = (loans) => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the current month

    const upcoming = [];
    const passed = [];
    const others = [];

    loans.forEach((loan) => {
      const startDate = new Date(loan.startDate.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
      const nextEmiDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()); // Assuming EMI is due next month

      // Check if the EMI due date is within the current month (from today till the end of the month)
      if (nextEmiDate >= currentDate && nextEmiDate <= endOfMonth) {
        upcoming.push({
          ...loan,
          notification: `Upcoming EMI for loan ${loan.name} due on ${nextEmiDate.toLocaleDateString()}`,
          icon: <FaExclamationCircle color="orange" />,
        });
      }

      // Check if the EMI is passed (due date is before current date)
      if (nextEmiDate < currentDate) {
        passed.push({
          ...loan,
          notification: `EMI for loan ${loan.name} was due on ${nextEmiDate.toLocaleDateString()}`,
          icon: <FaCheckCircle color="green" />,
        });
      }

      // You can add other notifications if required
      others.push({
        notification: `Other notifications related to loan ${loan.name}`,
      });
    });

    // Set the state for each category
    setUpcomingPayments(upcoming);
    setPassedEmis(passed);
    setOtherNotifications(others);
  };

  return (
    <div className="p-6 bg-black">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-4xl font-bold text-center text-gray-400 mb-6">Loan Notifications</h1>

      {/* Upcoming Payments Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-400 mb-4">Upcoming Payments</h2>
        <div>
          {upcomingPayments.length > 0 ? (
            upcomingPayments.map((notification, index) => (
              <div key={index} className="flex items-center bg-yellow-100 p-4 rounded-lg mb-3">
                {notification.icon}
                <p className="ml-3 text-gray-800">{notification.notification}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No upcoming payments for this month.</p>
          )}
        </div>
      </div>

      {/* Passed EMIs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-400 mb-4">Passed EMIs</h2>
        <div>
          {passedEmis.length > 0 ? (
            passedEmis.map((notification, index) => (
              <div key={index} className="flex items-center bg-green-100 p-4 rounded-lg mb-3">
                {notification.icon}
                <p className="ml-3 text-gray-800">{notification.notification}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No passed EMIs found.</p>
          )}
        </div>
      </div>

      {/* Other Notifications Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-400 mb-4">Other Notifications</h2>
        <div>
          {otherNotifications.length > 0 ? (
            otherNotifications.map((notification, index) => (
              <div key={index} className="flex items-center bg-gray-100 p-4 rounded-lg mb-3">
                <FaTimesCircle color="gray" />
                <p className="ml-3 text-gray-800">{notification.notification}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No other notifications.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

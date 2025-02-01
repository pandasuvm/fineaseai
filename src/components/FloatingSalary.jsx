import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Your firebase config
import { onAuthStateChanged } from "firebase/auth"; // Firebase Authentication module
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firebase Firestore functions
import { FaTimesCircle } from "react-icons/fa"; // Close Icon

const FloatingSalary = () => {
  const [user, setUser] = useState(null); // Store the authenticated user
  const [salary, setSalary] = useState("");
  const [showComponent, setShowComponent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkSalary();
    }
  }, [user]);

  const checkSalary = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.salary) {
          // Salary is already stored, so we don't show the prompt
          setShowComponent(false);
        } else {
          // Salary not stored, show the prompt
          setShowComponent(true);
        }
      }
    } catch (error) {
      console.error("Error checking salary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalarySubmit = async () => {
    if (!salary) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { salary: salary }, { merge: true });
      setShowComponent(false); // Hide the component after successful submission
    } catch (error) {
      console.error("Error saving salary:", error);
    }
  };

  const handleClose = () => {
    setShowComponent(false); // Close the component without saving
  };

  return (
    <>
      {!loading && showComponent && (
        <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg p-6 w-72">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Enter your monthly salary</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <FaTimesCircle />
            </button>
          </div>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-4"
            placeholder="Enter salary"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSalarySubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Salary
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSalary;

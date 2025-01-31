import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import necessary routing components
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth listener
import { auth } from './firebase'; // Import your firebase configuration
import Sidebar from './pages/Sidebar'; // Sidebar component
import Dashboard from './pages/Dashboard'; // Dashboard component
import LoanTracker from './pages/LoanTracker'; // LoanTracker component
import AiLoan from './pages/AiLoan'; // AiLoan component
import Expenses from './pages/Expenses'; // Expenses component
import Support from './pages/Support'; // Support component
import PromotionalPage from './pages/PromotionalPage'; // PromotionalPage component
import LoginPage from './pages/Login'; // LoginPage component

const App = () => {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState('/dashboard'); // Default selected item in the sidebar

  // Listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update the user state based on auth changes
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // Protected Route Component to protect routes
  const ProtectedRoute = ({ children }) => {
    return user ? children : <LoginPage />; // Show child components if user is authenticated, else show login
  };

  return (
    <Router>
      <Routes>
        {/* Promotional Page: Shows when not logged in */}
        <Route path="/" element={<PromotionalPage />} />

        {/* Login Page: Shows after clicking Login from Promotional Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar selected={selected} setSelected={setSelected} />
                <div className="main-content flex-grow p-4">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan-tracker"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar selected={selected} setSelected={setSelected} />
                <div className="main-content flex-grow p-4">
                  <LoanTracker />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-loan"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar selected={selected} setSelected={setSelected} />
                <div className="main-content flex-grow p-4">
                  <AiLoan />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar selected={selected} setSelected={setSelected} />
                <div className="main-content flex-grow p-4">
                  <Expenses />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar selected={selected} setSelected={setSelected} />
                <div className="main-content flex-grow p-4">
                  <Support />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

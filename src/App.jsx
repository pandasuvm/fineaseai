import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import { auth, db } from "./firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore"; // Firestore
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy loading pages
const Login = React.lazy(() => import("./pages/Login"));
const DashboardEmployer = React.lazy(() => import("./pages/DashboardEmployer"));
const DashboardJobSeeker = React.lazy(() => import("./pages/DashboardJobSeeker"));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor user authentication state and fetch role from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...userData, uid: currentUser.uid });
          } else {
            console.error("User data not found in Firestore!");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  return (
    <Router>
      <ToastContainer />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
        <Routes>
          {/* Login Route - Redirect Only If User is Fully Loaded & Has Role */}
          <Route
            path="/"
            element={
              user && user.role ? (
                <Navigate to={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"} replace />
              ) : (
                <Login onLogin={(userData) => setUser(userData)} />
              )
            }
          />

          {/* Protected Dashboard Route */}
          <Route path="/dashboard/employer" element={<ProtectedRoute user={user} role="employer" Component={DashboardEmployer} />} />
          <Route path="/dashboard/jobseeker" element={<ProtectedRoute user={user} role="jobSeeker" Component={DashboardJobSeeker} />} />

          {/* Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Protected Route Component - Prevents Unauthorized Access
const ProtectedRoute = ({ user, role, Component }) => {
  if (!user) return <Navigate to="/" replace />; // Redirect if not logged in
  if (user.role !== role) return <Navigate to="/" replace />; // Redirect if wrong role
  return <Component user={user} />;
};

export default App;

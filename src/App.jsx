import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy loading pages
const Login = React.lazy(() => import("./pages/Login"));
const DashboardEmployer = React.lazy(() => import("./flows/Job_Giver/DashboardEmployer"));
const DashboardJobSeeker = React.lazy(() => import("./pages/DashboardJobSeeker"));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState("en");

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

  // Load Google Translate Script and Hide Toolbar
  useEffect(() => {
    const googleTranslateInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    if (!window.google?.translate) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else {
      googleTranslateInit();
    }

    // Inject CSS to hide Google Translate toolbar
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      body > .skiptranslate { display: none !important; }
      body { top: 0px !important; }
    `;
    document.head.appendChild(style);
  }, []);

  // Change language function
  const changeLanguage = (lang) => {
    setSelectedLang(lang);
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  return (
    <Router>
      <ToastContainer />
      <div className="p-4 flex justify-end">
        {/* Language Selector */}
        <select
          value={selectedLang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="en">English</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="ta">Tamil (தமிழ்)</option>
          <option value="te">Telugu (తెలుగు)</option>
          <option value="bn">Bengali (বাংলা)</option>
          <option value="mr">Marathi (मराठी)</option>
          <option value="gu">Gujarati (ગુજરાતી)</option>
          <option value="kn">Kannada (ಕನ್ನಡ)</option>
          <option value="ml">Malayalam (മലയാളം)</option>
          <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
        </select>
      </div>

      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
        <Routes>
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
          <Route path="/dashboard/employer" element={<ProtectedRoute user={user} role="employer" Component={DashboardEmployer} />} />
          <Route path="/dashboard/jobseeker" element={<ProtectedRoute user={user} role="jobSeeker" Component={DashboardJobSeeker} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Protected Route Component
const ProtectedRoute = ({ user, role, Component }) => {
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <Component user={user} />;
};

export default App;

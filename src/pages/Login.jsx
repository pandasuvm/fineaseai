import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  // State Variables
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null,
    monthlySalary: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: null,
    }));
  };

  // Handle Login or Registration
  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCredential;
      let profilePhotoUrl = "";

      if (isNewUser) {
        // Create User
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const userId = userCredential.user.uid;

        // Upload Profile Photo if Exists (optional)
        if (formData.profilePhoto) {
          // Handle photo upload here (you can use Firebase Storage if required)
          // For now, we'll skip the storage part and leave it empty
        }

        // Save User Data in Firestore
        await setDoc(doc(db, "users", userId), {
          userId,
          name: formData.name,
          email: formData.email,
          profilePhoto: profilePhotoUrl,
          monthlySalary: formData.monthlySalary,
          createdAt: new Date(),
        });

        // Navigate to dashboard (after registration)
        navigate("/dashboard");
      } else {
        // Sign In User
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        // Navigate to dashboard after login
        navigate("/dashboard");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user data exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Save user data if doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          name: user.displayName,
          email: user.email,
          profilePhoto: user.photoURL,
          createdAt: new Date(),
        });
      }

      // Navigate to dashboard after Google login
      navigate("/dashboard");
    } catch (error) {
      alert(`Google Sign-In Error: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F6F9] font-Rampart">
      {/* Left Section */}
      <div className="w-2/5 bg-white flex flex-col justify-between p-0 pl-2 pr-2">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-left pl-16 pr-16">
            <h2 className="text-4xl font-bold mb-8 ">
              Welcome to <span className="text-[#2E3192]">FineEase</span>
            </h2>
            <p className=" text-gray-400 text-left">
              Fill out your personal details to get verified and manage all your loans at one place
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="components/Images/Login.png"
            alt="Bottom Image"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-3/5 flex items-center justify-center">
        <div className="w-[80%] max-w-3xl min-h-[70vh] overflow-scroll max-h-[70vh] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-left mb-8">
            {isNewUser ? "Register" : "Login"}
          </h2>

          {/* Conditional Rendering for Register Fields */}
          {isNewUser && (
            <>
              <div className="w-full">
                <div className="flex gap-8 mb-4">
                  <div className="flex flex-col w-[48%] gap-2">
                    <label className="font-semibold text-lg">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col w-[48%] gap-2">
                    <label className="font-semibold text-lg">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full gap-2 mb-4">
                  <label htmlFor="name" className="font-semibold text-lg">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col w-full gap-2 mb-4">
  <label htmlFor="monthlySalary" className="font-semibold text-lg">
    Monthly Salary
  </label>
  <input
    type="number"
    name="monthlySalary"
    placeholder="Enter your Monthly Salary"
    className="p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
    value={formData.monthlySalary}
    onChange={handleChange}
  />
</div>
              </div>
            </>
          )}

          {/* Conditional Rendering for Login Fields */}
          {!isNewUser && (
            <div className="flex flex-col gap-5">
              <div className="flex gap-6">
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className=" p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col w-[48%] gap-2">
                  <label className="font-semibold text-lg">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-3 mb-2 border border-[#DBDBDB] rounded-[8px] focus:outline-[#DBDBDB]"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Google Sign In */}
          <div className="flex flex-col gap-5 mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 px-4 bg-white border border-[#DBDBDB] rounded-lg flex items-center justify-center gap-2"
            >
              <img
                src="components/Images/google.png"
                alt="Google Icon"
                className="w-6 h-6"
              />
              Continue with Google
            </button>
          </div>

          {/* Bottom Links */}
          <div className="flex justify-between align-bottom mt-4">
            <p className="text-center mt-3 text-md font-base text-[#3E3E3E]">
              {isNewUser ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-[#2E3192] cursor-pointer font-medium"
                onClick={() => setIsNewUser(!isNewUser)}
              >
                {isNewUser ? "Login" : "Register"}
              </span>
            </p>
            <button
              onClick={handleAuth}
              className="w-[170px] bg-[#2E3192] text-white p-2 rounded-2xl cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Processing..." : isNewUser ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

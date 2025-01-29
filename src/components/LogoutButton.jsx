import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the login page or home page after logging out
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#2E3192] text-white p-2 w-[170px] rounded-2xl cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

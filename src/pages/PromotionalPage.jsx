import React from 'react';
import { Link } from 'react-router-dom'; // Import Link to handle navigation

const PromotionalPage = () => {
  return (
    <div className="promo-container flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Service!</h1>
        <p className="text-xl mb-6">
          Sign up or log in to explore our features and start using our platform.
        </p>
        <Link to="/login">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out">
            Login / Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PromotionalPage;

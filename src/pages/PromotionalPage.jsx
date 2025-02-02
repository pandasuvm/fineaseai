import React from "react";
import { Link } from "react-router-dom";

const PromotionalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold">FineEase</h1>
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20">
        <h1 className="text-6xl font-bold text-gray-600 animate-pulse">FineEase</h1>
        <p className="text-2xl text-gray-500 mt-4">Finance Made Easy</p>
      </header>

      {/* Intro Section */}
      <section className="text-center px-10 py-10">
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          et ligula in dui tempor placerat.
        </p>
      </section>

      {/* Images Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 py-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 1</div>
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 2</div>
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 3</div>
      </section>

      {/* Testimonials Section (Auto-Moving Carousel) */}
      <section className="py-10 px-10 overflow-hidden relative">
        <h2 className="text-2xl font-bold text-center mb-6">What Our Users Say</h2>
        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-block px-6 py-4 bg-white shadow-lg rounded-lg mr-4">
            "Amazing platform! Helped me manage my loans effortlessly."
          </div>
          <div className="inline-block px-6 py-4 bg-white shadow-lg rounded-lg mr-4">
            "The UI is clean and simple. Highly recommended!"
          </div>
          <div className="inline-block px-6 py-4 bg-white shadow-lg rounded-lg">
            "Fantastic customer support and easy-to-use features!"
          </div>
        </div>
      </section>

      {/* Call-to-Action (CTA) Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-10">
        <h2 className="text-3xl font-bold mb-4">Try FineEase Today!</h2>
        <Link to="/login">
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition">
            Sign Up / Login
          </button>
        </Link>
      </section>
    </div>
  );
};

export default PromotionalPage;

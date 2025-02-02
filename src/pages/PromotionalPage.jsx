import React from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";

const PromotionalPage = () => {
  return (
    <div className="text-gray-900">
      {/* Navbar */}
      <HomeNavbar />

      {/* Landing Section */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-between px-24"
        style={{
          backgroundImage: "url('components/Images/homebg.jpg')", // Background image for the landing section
        }}
      >
        {/* Content on left */}
        <div className="w-[57%] ml-10 pr-24 text-white">
          <h1 className="text-black font-bold font-wide mb-4 text-6xl">
            Welcome to Fin<span className="text-[#8C7BF3]">Ease</span>
          </h1>
          <p className="text-lg mb-6 text-black max-w-3xl">
            Simplify your financial journey with the best loan and repayment solutions.
          </p>
          <Link to="/login">
            <button className="px-6 py-3 bg-white text-black rounded-3xl hover:bg-gray-200 cursor-pointer transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Image on the right */}
        <div className="w-[43%]">
          <img
            src="components/Images/landing.png" // Replace with the actual image URL
            alt="Promotional"
            className="object-cover w-full h-full opacity-90 rounded-3xl pr"
          />
        </div>
      </section>

      {/* Hero Section */}
      <section className="text-center px-10 py-10 flex items-center">
  <div className="flex-1">
    <img src="components/Images/about.png" alt="Description" className="w-full h-auto rounded-lg shadow-lg" />
  </div>

  {/* Right Section */}
  <div className="flex-1 pl-10 text-left">
    <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-wide">Our AI Loan Recommender</h2>
    <p className="text-lg text-gray-700 max-w-2xl w-[320px] text-left">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et ligula in dui tempor placerat.
    </p>
  </div>
</section>


      {/* Images Section */}
      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 py-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 1</div>
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 2</div>
        <div className="bg-white p-6 rounded-lg shadow-lg">Image 3</div>
      </section> */}

      {/* Testimonials Section (Auto-Moving Carousel) */}
      {/* <section className="py-10 px-10 overflow-hidden relative">
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
      </section> */}

      {/* Call-to-Action (CTA) Banner */}
      {/* <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-10">
        <h2 className="text-3xl font-bold mb-4">Try FineEase Today!</h2>
        <Link to="/login">
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-200 transition">
            Sign Up / Login
          </button>
        </Link>
      </section> */}

<footer className="bg-black text-white py-4">
  <div className="container mx-auto flex justify-between items-center">
    {/* Finease on the left */}
    <div className="text-3xl font-semibold font-wide">
      Fin<span className="text-[#8C7BF3]">Ease</span>
    </div>

    {/* Copyright in the middle */}
    <div className="text-sm text-center">
      &copy; {new Date().getFullYear()} All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
};

export default PromotionalPage;

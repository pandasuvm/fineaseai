import React from "react";

const DashboardEmployer= ({ user }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, Employer!</h1>
      <p className="text-gray-500 text-sm text-center mt-2">
        You are now logged in to your dashboard.
      </p>
      {/* You can add more content like job offers, user settings, etc. */}
    </div>
  );
};

export default DashboardEmployer;

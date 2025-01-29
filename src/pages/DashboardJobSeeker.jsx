import React from 'react';
import LogoutButton from '../components/LogoutButton';

function DashboardJobSeeker() {
    return (
        <div>
             <div className="min-h-screen gap-6 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, jobSeeker!</h1>
      <p className="text-gray-500 text-sm text-center mt-2">
        You are now logged in to your dashboard.
      </p>
      <LogoutButton/>
      {/* You can add more content like job offers, user settings, etc. */}
    </div>
        </div>
    );
}

export default DashboardJobSeeker;
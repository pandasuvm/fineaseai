import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar bg-white p-4 flex justify-between border border-b-2 border-gray-200 items-center shadow-lg z-10 relative">
      <div className='font-bold text-xl'>Logo</div>
      <div className="profile-circle bg-gray-300 rounded-full w-8 h-8"></div>
    </nav>
  );
};

export default Navbar;

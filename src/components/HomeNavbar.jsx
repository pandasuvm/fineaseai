import React from 'react';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
      <div className="font-bold text-2xl ml-3 font-wide text-black">Fin<span className='text-[#8C7BF3]'>Ease</span></div>
        <div className="flex space-x-8">
          <Link to="/" className="nav-link font-wide font-normal">Home</Link>
          <Link to="/about" className="nav-link font-wide font-normal">About</Link>
          <Link to="/product" className="nav-link font-wide font-normal">Product</Link>
          <Link to="/reviews" className="nav-link font-wide font-normal">Reviews</Link>
        </div>
        <div>
          <Link to="/login" className="bg-[#8C7BF3] border border-black rounded-3xl px-8 text-white font-semibold cursor-pointer py-2">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;

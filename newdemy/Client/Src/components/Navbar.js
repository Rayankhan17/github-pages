import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">UdemyCoupons</Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/courses" className="hover:underline">All Courses</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
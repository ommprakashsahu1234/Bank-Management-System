import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm sm:text-base mb-3 sm:mb-0 max-w-xl text-center sm:text-left">
          © 2025 Omm Prakash Sahu. <br />Bank Management System <br /> Committed to serving you with trust and excellence in banking services.
        </p>
        <div className="flex gap-3">
          <Link
            to="/about"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-sm sm:text-base"
          >
            Learn More About Us
          </Link>
          <Link
            to="/add-suggestion"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition text-sm sm:text-base"
          >
            Add Suggestion
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

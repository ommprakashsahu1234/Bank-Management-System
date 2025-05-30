import React from 'react';
import { Link } from 'react-router-dom';

function Err404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f7fa] text-center px-4">
      <div className="animate-bounce text-blue-700 font-extrabold text-[120px] leading-none select-none">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-4 animate-fadeIn">
        Oops! Page Not Found.
      </h1>
      <p className="text-gray-600 mt-2 text-lg animate-fadeIn delay-200">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition duration-300 animate-fadeIn delay-300"
      >
        Go Back to Home
      </Link>
    </div>
  );
}

export default Err404;

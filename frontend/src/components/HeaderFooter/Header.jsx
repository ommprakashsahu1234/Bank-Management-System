import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../assets/logo.png";
function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2 bg-gray-900 shadow-md">
      <div className="flex items-center space-x-3">
        <img
          src={Logo}
          alt="Bank Logo"
          className="w-[96px] h-[96px] object-contain"
          />
        <h1 className="text-lg font-bold font-[Helvetica] text-white">
          Bank Management System
        </h1>
      </div>

      <h1 className="mt-2 sm:mt-0 font-bold inline-block px-4 py-1 text-white rounded transition">
        Trust of Crores of Bharatiyas.
      </h1>
    </header>
  );
}

export default Header;

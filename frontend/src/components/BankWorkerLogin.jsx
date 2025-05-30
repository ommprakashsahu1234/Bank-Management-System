import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BankWorkerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workerId: "",
    password: "",
  });

  const [error, setError] = useState(""); // For error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.workerId.trim()) {
      setError("Worker ID cannot be empty.");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/bankworker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
      } else {
        localStorage.setItem("bankworker-token", data.token);

        navigate("/bankworker/dashboard");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again later.");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#f4f7fa] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Bank Worker Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="workerId"
              className="block text-sm font-medium text-gray-700"
            >
              Bank Worker ID
            </label>
            <input
              type="text"
              id="workerId"
              name="workerId"
              value={formData.workerId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your ID"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>

          {/* Error message */}
          <p
            className={`mt-3 text-red-600 font-medium ${
              error ? "block" : "hidden"
            }`}
          >
            {error}
          </p>
        </form>
      </div>
    </div>
  );
}

export default BankWorkerLogin;

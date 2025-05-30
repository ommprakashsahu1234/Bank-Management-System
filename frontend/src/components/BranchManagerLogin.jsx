import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function BranchManagerLogin() {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    branchManagerId: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/branchmanager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Login response data:", data);

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('bm-token', data.token);
    console.log("Navigating to dashboard");
    navigate('/branchmanager/dashboard');

  } catch (err) {
    console.error('Login error:', err.message);
    setError(err.message || 'Something went wrong. Please try again.');
  }
};


  return (
    <div className="min-h-[85vh] bg-[#f4f7fa] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Branch Manager Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="branchManagerId" className="block text-sm font-medium text-gray-700">
              Branch Manager ID
            </label>
            <input
              type="text"
              id="branchManagerId"
              name="branchManagerId"
              value={formData.branchManagerId}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your ID"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default BranchManagerLogin;

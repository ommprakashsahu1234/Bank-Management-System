import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BankManagerLogin() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/bankmanager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          managerId: adminId,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('bankmanager-token', data.token);
      navigate('/bankmanager/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Bank Manager Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin ID
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default BankManagerLogin;

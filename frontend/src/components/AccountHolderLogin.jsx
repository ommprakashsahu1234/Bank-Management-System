import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccountHolderLogin() {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^BR\d{10}$/.test(accountNumber)) {
      setError('Please enter a valid 12-character account number (e.g., BR0125000001).');
      return;
    }

    if (!password) {
      setError('Password cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
      } else {
        if (data.token) {
          localStorage.setItem('accountHolder-token', data.token); // Save token
          navigate('/');
        } else {
          setError('Login successful but token not received.');
        }
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Account Holder Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountnumber"
              maxLength={12}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.toUpperCase())} 
              placeholder="Enter 12-character account number"
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white font-semibold py-2 rounded-md hover:bg-blue-800 transition duration-200"
          >
            Login
          </button>
          {error && (
            <p className="mt-3 text-red-600 font-medium">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AccountHolderLogin;

import React, { useState } from 'react';

function BankWorkerDepositAmount() {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

const handleFetchAccount = async () => {
  setError('');
  setMessage('');
  try {
    const token = localStorage.getItem('bankworker-token'); 
    const res = await fetch(`http://localhost:5000/bankworker/account/${accountNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to fetch account');
    }
    const data = await res.json();
    setAccountData(data);
  } catch (err) {
    setError(err.message);
    setAccountData(null);
  }
};


const handleDeposit = async () => {
  setError('');
  setMessage('');

  if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
    setError('Enter a valid deposit amount.');
    return;
  }

  try {
    const token = localStorage.getItem('bankworker-token'); // Get JWT token
    const res = await fetch('http://localhost:5000/bankworker/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add token here
      },
      body: JSON.stringify({
        accountNumber,
        amount: Number(depositAmount),
        remarks,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Deposit failed');

    setMessage('Deposit successful!');
    setAccountData((prev) => ({
      ...prev,
      balance: prev.balance + Number(depositAmount),
    }));
    setDepositAmount('');
    setRemarks('');
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Deposit Money to Account</h2>
      
      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Enter Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />
      <button
        onClick={handleFetchAccount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Fetch Details
      </button>

      {accountData && (
        <div className="mt-6">
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Account Holder Name</th>
                <th className="border px-4 py-2">Current Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{accountData.name}</td>
                <td className="border px-4 py-2">₹{accountData.balance}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter Amount to Deposit"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={handleDeposit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Deposit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankWorkerDepositAmount;

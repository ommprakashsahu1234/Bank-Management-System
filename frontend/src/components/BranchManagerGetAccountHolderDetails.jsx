import React, { useState } from 'react';

function BranchManagerGetAccountHolderDetails() {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(null);
  const [error, setError] = useState('');

  const fetchAccountHolderDetails = async () => {
    try {
      const token = localStorage.getItem('bm-token');
      const res = await fetch(`http://localhost:5000/branchmanager/accountholderdetails/${accountNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch account holder details");
      }

      const data = await res.json();
      setAccountHolder(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setAccountHolder(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Get Account Holder Details</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={fetchAccountHolderDetails}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Fetch Details
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {accountHolder && (
        <table className="table-auto w-full border mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Field</th>
              <th className="border px-2 py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border px-2 py-1">Name</td><td className="border px-2 py-1">{accountHolder.name}</td></tr>
            <tr><td className="border px-2 py-1">Email</td><td className="border px-2 py-1">{accountHolder.email}</td></tr>
            <tr><td className="border px-2 py-1">Mobile</td><td className="border px-2 py-1">{accountHolder.mobno}</td></tr>
            <tr><td className="border px-2 py-1">Account Number</td><td className="border px-2 py-1">{accountHolder.accountNumber}</td></tr>
            <tr><td className="border px-2 py-1">Branch ID</td><td className="border px-2 py-1">{accountHolder.branchId}</td></tr>
            <tr><td className="border px-2 py-1">Address</td><td className="border px-2 py-1">{accountHolder.address || '-'}</td></tr>
            <tr><td className="border px-2 py-1">Balance</td><td className="border px-2 py-1">₹{accountHolder.balance}</td></tr>
            <tr><td className="border px-2 py-1">Created At</td><td className="border px-2 py-1">{new Date(accountHolder.createdAt).toLocaleString()}</td></tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BranchManagerGetAccountHolderDetails;

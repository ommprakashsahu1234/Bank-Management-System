import React, { useEffect, useState } from 'react';

function BankWokerCreateAccountHolder() {
  const [accountNumber, setAccountNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobno: '',
    password: '',
    address: '',
    balance: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('bankworker-token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/bankworker/generate-account-number', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to get account number');
        }
        return res.json();
      })
      .then((data) => {
        setAccountNumber(data.accountNumber);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const token = localStorage.getItem('bankworker-token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    // Prepare data to send
    const payload = {
      ...formData,
      accountNumber,
    };

    fetch('http://localhost:5000/bankworker/create-account-holder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create account holder');
        }
        return res.json();
      })
      .then((data) => {
        setSuccessMsg('Account holder created successfully!');
        // Clear form except account number (which will be refreshed on next load)
        setFormData({
          name: '',
          email: '',
          mobno: '',
          password: '',
          address: '',
          balance:'0',
        });

        // Optionally fetch a new account number again for next creation
        return fetch('http://localhost:5000/bankworker/generate-account-number', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.accountNumber) setAccountNumber(data.accountNumber);
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Create Account Holder</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="mobno"
          placeholder="Mobile Number"
          value={formData.mobno}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="balance"
          placeholder="Initial Deposit"
          value={formData.balance}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="accountNumber"
          value={accountNumber}
          disabled
          className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Create Account Holder
        </button>
      </form>
    </div>
  );
}

export default BankWokerCreateAccountHolder;

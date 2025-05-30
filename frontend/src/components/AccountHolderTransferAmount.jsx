import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AccountHolderTransferAmount() {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accountHolder-token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:5000/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setAccountNumber(data.accountNumber);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        navigate('/login');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const token = localStorage.getItem('accountHolder-token');

    if (!receiverAccountNumber || !amount) {
      setStatus('Please fill in all fields.');
      return;
    }

    if (receiverAccountNumber === accountNumber) {
      setStatus('You cannot transfer money to yourself.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (parsedAmount > balance) {
      setStatus('Insufficient balance.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/account-holder/transfer-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderAccountNumber: accountNumber,
          receiverAccountNumber,
          amount: parsedAmount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ Transfer successful. ₹${parsedAmount} sent to ${receiverAccountNumber}.`);
        setBalance((prev) => prev - parsedAmount);
        setReceiverAccountNumber('');
        setAmount('');
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error transferring money:', error);
      setStatus('❌ Server error during transfer.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold text-center text-blue-800 mb-4">Transfer Money</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Receiver Account Number</label>
          <input
            type="text"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Amount to Send (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
        >
          Send Money
        </button>
      </form>

      {status && <p className="mt-4 text-center text-red-600">{status}</p>}

      <div className="mt-6 text-center text-gray-600">
        <p>Your Current Balance: <span className="font-bold">₹{balance.toFixed(2)}</span></p>
      </div>
    </div>
  );
}

export default AccountHolderTransferAmount;

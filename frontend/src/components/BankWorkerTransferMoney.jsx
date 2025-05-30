import React, { useState, useEffect } from 'react';

function BankWorkerTransferMoney() {
  const [senderAcc, setSenderAcc] = useState('');
  const [receiverAcc, setReceiverAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [appNo, setAppNo] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [senderBalance, setSenderBalance] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  const fetchAccountName = async (accountNumber, setName, setBalance = null) => {
    try {
      const token = localStorage.getItem('bankworker-token');
      if (!token) {
        window.location.href = '/bankworker';
        return;
      }

      const res = await fetch(`${API_BASE_URL}/bankworker/account/${accountNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setName(data.name);
      if (setBalance !== null) setBalance(data.balance);
    } catch (err) {
      setName('Invalid Account Number');
      if (setBalance !== null) setBalance(null);
    }
  };

  useEffect(() => {
    if (senderAcc.length === 12) {
      fetchAccountName(senderAcc, setSenderName, setSenderBalance);
    } else {
      setSenderName('');
      setSenderBalance(null);
    }
  }, [senderAcc]);

  useEffect(() => {
    if (receiverAcc.length === 12) {
      fetchAccountName(receiverAcc, setReceiverName);
    } else {
      setReceiverName('');
    }
  }, [receiverAcc]);

  const handleTransfer = async () => {
    setError('');
    setSuccess('');
    const amt = Number(amount);

    if (!senderName || !receiverName || senderName === 'Invalid Account Number' || receiverName === 'Invalid Account Number') {
      return setError('Please enter valid account numbers.');
    }
    if (senderName === receiverName) return setError('Cannot send Amount to Own Account.');
    if (!amt || amt <= 0) return setError('Enter a valid amount.');
    if (amt > senderBalance) return setError('Insufficient balance in sender account.');
    if (appNo.length !== 4) return setError('Application number must be 4 digits.');

    try {
      const res = await fetch(`${API_BASE_URL}/bankworker/transfer-money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bankworker-token')}`,
        },
        body: JSON.stringify({
          from: senderAcc,
          to: receiverAcc,
          amount: amt,
          applicationNumber: appNo,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Transfer failed.');
      }

      setSuccess('Transfer successful.');
      setSenderAcc('');
      setReceiverAcc('');
      setAmount('');
      setAppNo('');
      setSenderName('');
      setReceiverName('');
      setSenderBalance(null);
    } catch (err) {
      setError(err.message || 'Transfer failed.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Bank Worker Money Transfer</h2>
      <div>
        <input
          type="text"
          maxLength="12"
          value={senderAcc}
          onChange={(e) => setSenderAcc(e.target.value)}
          placeholder="Sender's Account Number"
          className="border p-2 w-full rounded mb-1"
        />
        <input
          type="text"
          value={senderName}
          placeholder="Sender's Name"
          disabled
          className={`border p-2 w-full rounded ${senderName === 'Invalid Account Number' ? 'text-red-500' : ''}`}
        />
      </div>
      <div>
        <input
          type="text"
          maxLength="12"
          value={receiverAcc}
          onChange={(e) => setReceiverAcc(e.target.value)}
          placeholder="Receiver's Account Number"
          className="border p-2 w-full rounded mb-1"
        />
        <input
          type="text"
          value={receiverName}
          placeholder="Receiver's Name"
          disabled
          className={`border p-2 w-full rounded ${receiverName === 'Invalid Account Number' ? 'text-red-500' : ''}`}
        />
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to Transfer"
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        maxLength="4"
        value={appNo}
        onChange={(e) => setAppNo(e.target.value)}
        placeholder="4-digit Application Number"
        className="border p-2 w-full rounded"
      />

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        onClick={handleTransfer}
        disabled={
          !senderName ||
          !receiverName ||
          senderName === 'Invalid Account Number' ||
          receiverName === 'Invalid Account Number' ||
          !amount ||
          amount <= 0 ||
          amount > senderBalance ||
          appNo.length !== 4
        }
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
      >
        Transfer Money
      </button>
    </div>
  );
}

export default BankWorkerTransferMoney;

import React, { useState, useEffect } from 'react';

function BankWorkerRequestLoan() {
  const [formData, setFormData] = useState({
    accountHolderNumber: '',
    parentAmount: '',
    amountToBePaid: '',
    interestRate: '',
    tenureMonths: '',
    purpose: '',
  });

  const [loanId, setLoanId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('bankworker-token');
    if (!token) {
      setError('Unauthorized. No token found.');
      return;
    }

    fetch('http://localhost:5000/bankworker/info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.text();
          throw new Error(data);
        }
        return res.json();
      })
      .then((data) => {
        setWorkerId(data.workerId);
        setBranchId(data.branchId);
      })
      .catch((err) => setError(`Worker info fetch failed: ${err.message}`));
  }, []);

  useEffect(() => {
    if (formData.accountHolderNumber) {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const generatedLoanId = `${formData.accountHolderNumber}${today}`;
      setLoanId(generatedLoanId);
    }
  }, [formData.accountHolderNumber]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');

  const token = localStorage.getItem('bankworker-token');
  if (!token) {
    setError('Unauthorized');
    return;
  }

  try {
    // 🔎 Check loan eligibility
    const eligibilityRes = await fetch(`http://localhost:5000/check-loan-eligibility/${formData.accountHolderNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const eligibilityData = await eligibilityRes.json();

    if (!eligibilityRes.ok) {
      throw new Error(eligibilityData.error || 'Eligibility check failed');
    }

    if (!eligibilityData.eligible) {
      setError(`Cannot request loan: ${eligibilityData.reason}`);
      return;
    }

    // ✅ Eligible → proceed with loan request
    const payload = {
      ...formData,
      loanId,
      appliedByWorkerId: workerId,
      approvedByBranchManagerId: false,
      branchId,
    };

    const res = await fetch('http://localhost:5000/bankworker/request-loan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Loan request failed');

    setSuccessMsg('Loan request submitted successfully!');
    setFormData({
      accountHolderNumber: '',
      parentAmount: '',
      amountToBePaid: '',
      interestRate: '',
      tenureMonths: '',
      purpose: '',
    });
  } catch (err) {
    setError(err.message);
  }
};



  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Request Loan for Account Holder</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="accountHolderNumber"
          placeholder="Account Holder Number"
          value={formData.accountHolderNumber}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="parentAmount"
          placeholder="Loan Amount (Principal)"
          value={formData.parentAmount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="interestRate"
          placeholder="Interest Rate (%)"
          value={formData.interestRate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="tenureMonths"
          placeholder="Tenure (Months)"
          value={formData.tenureMonths}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="amountToBePaid"
          placeholder="Total Amount To Be Paid"
          value={formData.amountToBePaid}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="purpose"
          placeholder="Purpose of Loan"
          value={formData.purpose}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Loan Request
        </button>
      </form>
    </div>
  );
}

export default BankWorkerRequestLoan;

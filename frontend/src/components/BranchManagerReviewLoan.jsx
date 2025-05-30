import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function BranchManagerReviewLoan() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bm-token');
    if (!token) {
      navigate('/branchmanager');
      return;
    }

    const fetchData = loanId
      ? fetch(`http://localhost:5000/branchmanager/loans/${loanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : fetch('http://localhost:5000/branchmanager/loans', {
          headers: { Authorization: `Bearer ${token}` },
        });

    fetchData
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch loan(s)');
        return res.json();
      })
      .then(data => {
        if (loanId) setLoan(data);
        else setLoans(data);
        setLoading(false);
      })
      .catch(() => navigate('/branchmanager'));
  }, [loanId, navigate]);

  const handleUpdateLoanStatus = (newStatus) => {
    const token = localStorage.getItem('bm-token');
    fetch(`http://localhost:5000/branchmanager/loans/${loanId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Faied to ${newStatus} loan`);
        alert(`Loan ${newStatus} successfully`);
        navigate('/branchmanager/review-loans');
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <p className="text-center text-lg font-medium">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {loanId && loan ? (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Loan Details</h2>
          <div className="overflow-x-auto shadow rounded-lg mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <tbody>
                <tr className="border-b">
                  <th className="w-2/5 px-4 py-3 bg-gray-100 font-medium text-left">Loan ID</th>
                  <td className="px-4 py-3">{loan.loanId}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-3 bg-gray-100 font-medium text-left">Amount Applied</th>
                  <td className="px-4 py-3">{loan.parentAmount}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-3 bg-gray-100 font-medium text-left">Account Holder No</th>
                  <td className="px-4 py-3">{loan.accountHolderNumber}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-3 bg-gray-100 font-medium text-left">Purpose</th>
                  <td className="px-4 py-3">{loan.purpose}</td>
                </tr>
                <tr className="border-b">
                  <th className="px-4 py-3 bg-gray-100 font-medium text-left">Apply Date</th>
                  <td className="px-4 py-3">{new Date(loan.applicationDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3 bg-gray-100 font-medium text-left">Applied by Worker ID</th>
                  <td className="px-4 py-3">{loan.appliedByWorkerId}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleUpdateLoanStatus('approved')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdateLoanStatus('rejected')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Reject
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Pending Loans</h2>
          {loans.length === 0 ? (
            <p className="text-center text-gray-600">No pending loans</p>
          ) : (
            <div className="overflow-x-auto shadow rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Loan ID</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Account Holder</th>
                    <th className="px-4 py-3 text-left">Purpose</th>
                    <th className="px-4 py-3 text-left">Applied Date</th>
                    <th className="px-4 py-3 text-left">Applied by Worker</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.loanId} className="border-b hover:bg-blue-50">
                      <td className="px-4 py-3">{loan.loanId}</td>
                      <td className="px-4 py-3">{loan.parentAmount}</td>
                      <td className="px-4 py-3">{loan.accountHolderNumber}</td>
                      <td className="px-4 py-3">{loan.purpose}</td>
                      <td className="px-4 py-3">{new Date(loan.applicationDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{loan.appliedByWorkerId}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            navigate(`/branchmanager/review-loans/${loan.loanId}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BranchManagerReviewLoan;

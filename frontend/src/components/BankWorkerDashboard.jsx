import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BankWorkerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bankworker-token');
    if (!token) {
      navigate('/bankworker');
      return;
    }

    fetch('http://localhost:5000/bankworker/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          navigate('/bankworker');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        navigate('/bankworker');
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('bankworker-token');
    navigate('/bankworker');
  }

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Bank Worker Dashboard</h1>

      {/* User Info Table */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <td className="border border-gray-300 px-4 py-2">{userData.name}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <td className="border border-gray-300 px-4 py-2">{userData.email}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Mobile</th>
              <td className="border border-gray-300 px-4 py-2">{userData.mobno}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Worker ID</th>
              <td className="border border-gray-300 px-4 py-2">{userData.workerId}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Branch Manager ID</th>
              <td className="border border-gray-300 px-4 py-2">{userData.branchManagerId}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Branch ID</th>
              <td className="border border-gray-300 px-4 py-2">{userData.branchId}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
              <td className="border border-gray-300 px-4 py-2">{userData.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <button
            onClick={() => navigate('/bankworker/request-loan')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Request Loan
          </button>
          <button
            onClick={() => navigate('/bankworker/create-account-holder')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Create Account Holder
          </button>
          <button
            onClick={() => navigate('/bankworker/transfer-money')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Transfer Money
          </button>
          <button
            onClick={() => navigate('/bankworker/pay-loan')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Pay Loan
          </button>
          <button
            onClick={() => navigate('/bankworker/deposit-money')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Deposit Money
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default BankWorkerDashboard;

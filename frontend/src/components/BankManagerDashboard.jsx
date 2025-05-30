import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BankManagerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('bankmanager-token');
      if (!token) {
        navigate('/bankmanager');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/bankmanager/dashboard', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          navigate('/bankmanager');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        navigate('/bankmanager');
      }
    };

    fetchDashboard();
  }, [navigate]);

    function handleLogout() {
    localStorage.removeItem('bankmanager-token');
    navigate('/branchmanager');
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bank Manager Dashboard</h1>
      <table className="min-w-full border border-gray-300 rounded">
        <tbody>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left w-1/3">Name</th>
            <td className="border px-4 py-2">{data.name}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Manager ID</th>
            <td className="border px-4 py-2">{data.managerId}</td>
          </tr>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Address</th>
            <td className="border px-4 py-2">{data.address}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-left">Email</th>
            <td className="border px-4 py-2">{data.email}</td>
          </tr>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Mobile No</th>
            <td className="border px-4 py-2">{data.mobno}</td>
          </tr>
        </tbody>
      </table>

      {/* Buttons under the table */}
      <div className="mt-6 flex flex-col gap-3 max-w-md">
        <button
          onClick={() => navigate('/bankmanager/add-branch')}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Branch Details
        </button>
        <button
          onClick={() => navigate('/bankmanager/add-branchmanager')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Branch Manager
        </button>
        <button
          onClick={() => navigate('/bankmanager/delete-branchmanagers')}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Edit Branch Manager Details
        </button>
                  <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default BankManagerDashboard;

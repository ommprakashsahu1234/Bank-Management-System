import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BranchManagerDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('bm-token');
      if (!token) {
        navigate('/branchmanager');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/branchmanager/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || !response.ok) {
          navigate('/branchmanager');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch {
        navigate('/branchmanager');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function handleLogout() {
    localStorage.removeItem('bm-token');
    navigate('/branchmanager');
  }

  return (
    <div className="min-h-[85vh] px-4 sm:px-6 md:px-8 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Branch Manager Dashboard</h1>

      <div className="overflow-x-auto max-w-full">
  <table className="table-auto border-collapse border border-gray-300 mb-6 mx-auto">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-3 sm:px-4 py-2 text-left text-sm sm:text-base min-w-[120px]">Field</th>
        <th className="border border-gray-300 px-3 sm:px-4 py-2 text-left text-sm sm:text-base max-w-xs">Value</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(user).map(([key, value]) => (
        <tr key={key}>
          <td className="border border-gray-300 px-3 sm:px-4 py-2 font-semibold text-sm sm:text-base">{capitalize(key)}</td>
          <td className="border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base max-w-xs truncate">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Buttons container with responsive flex wrap */}
      <div className="flex flex-wrap gap-4 justify-center max-w-md mx-auto">
        <button
          onClick={() => navigate('/branchmanager/add-bankworker')}
          className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Bank Worker
        </button>
        <button
          onClick={() => navigate('/branchmanager/review-loans')}
          className="flex-1 min-w-[140px] px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Review Loans
        </button>
        <button
          onClick={() => navigate('/branchmanager/delete-workers')}
          className="flex-1 min-w-[140px] px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        >
          Edit Bank Workers
        </button>
        <button
          onClick={() => navigate('/branchmanager/see-loans')}
          className="flex-1 min-w-[140px] px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          See Loans
        </button>
        <button
          onClick={() => navigate('/branchmanager/accountholderdetails')}
          className="flex-1 min-w-[140px] px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          Get Account Holder Details
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 min-w-[140px] px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default BranchManagerDashboard;

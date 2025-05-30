import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BankManagerEditBranchManager() {
  const [branchManagers, setBranchManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('bankmanager-token');

  useEffect(() => {
    if (!token) {
      navigate('/bankmanager');
      return;
    }

    const fetchBranchManagers = async () => {
      try {
        const res = await fetch('http://localhost:5000/bankmanager/delete-branchmanagers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Redirect if token expired or unauthorized
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          navigate('/bankmanager');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch branch managers.');
        }

        const data = await res.json();
        setBranchManagers(data);
      } catch (err) {
        setError(err.message    );
      } finally {
        setLoading(false);
      }
    };

    fetchBranchManagers();
  }, [navigate, token]);

  const handleDelete = async (branchManagerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this branch manager?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/bankmanager/delete-branchmanagers/${branchManagerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        navigate('/bankmanager');
        return;
      }

      if (!res.ok) throw new Error('Failed to delete branch manager.');

      setBranchManagers((prev) =>
        prev.filter((bm) => bm.branchManagerId !== branchManagerId)
      );
      alert('Branch manager deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-700">Loading branch managers...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Branch Managers Under You</h2>
      {branchManagers.length === 0 ? (
        <p className="text-center text-gray-600">No branch managers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Branch Manager ID</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Branch ID</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {branchManagers.map((bm, index) => (
                <tr key={bm.branchManagerId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{bm.branchManagerId}</td>
                  <td className="px-4 py-3 border-b">{bm.name}</td>
                  <td className="px-4 py-3 border-b">{bm.branchId}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => handleDelete(bm.branchManagerId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BankManagerEditBranchManager;

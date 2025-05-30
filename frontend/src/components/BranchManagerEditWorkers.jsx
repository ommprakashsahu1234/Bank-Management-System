import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BranchManagerEditWorkers() {
  const [bankWorkers, setBankWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('bm-token');

  useEffect(() => {
    if (!token) {
      navigate('/branchmanager');
      return;
    }

    const fetchBankWorkers = async () => {
      try {
        const res = await fetch('http://localhost:5000/branchmanager/delete-workers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('branchmanager-token');
          navigate('/branchmanager');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch bank workers.');

        const data = await res.json();
        setBankWorkers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBankWorkers();
  }, [navigate, token]);

  const handleDelete = async (workerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bank worker?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/branchmanager/delete-workers/${workerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('bm-token');
        navigate('/branchmanager');
        return;
      }

      if (!res.ok) throw new Error('Failed to delete bank worker.');

      setBankWorkers((prev) => prev.filter((bw) => bw.workerId !== workerId));
      alert('Bank worker deleted successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-700">Loading bank workers...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Bank Workers Under You</h2>
      {bankWorkers.length === 0 ? (
        <p className="text-center text-gray-600">No bank workers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Worker ID</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Branch ID</th>
                <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {bankWorkers.map((bw, index) => (
                <tr key={bw.workerId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b">{bw.workerId}</td>
                  <td className="px-4 py-3 border-b">{bw.name}</td>
                  <td className="px-4 py-3 border-b">{bw.branchId}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      onClick={() => handleDelete(bw.workerId)}
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

export default BranchManagerEditWorkers;

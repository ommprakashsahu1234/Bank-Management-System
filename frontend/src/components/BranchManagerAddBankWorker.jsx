import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BranchManagerAddBankWorker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobno: '',          // matched naming convention
    address: '',
    workerId: '',
    password: '',
    branchId: '',
    branchManagerId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('bm-token');
      if (!token) {
        navigate('/branchmanager');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/branchmanager/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();

        setFormData(prev => ({
          ...prev,
          branchId: data.branchId || '',
          branchManagerId: data.branchManagerId || data._id || '',
        }));
      } catch {
        navigate('/branchmanager');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('bm-token');
    if (!token) {
      alert('Authentication token missing, please login again.');
      navigate('/branchmanager');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/branchmanager/add-bankworker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add bank worker');
      }

      alert('Bank Worker added successfully!');
      navigate('/branchmanager/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Add Bank Worker</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder='Bank Worker Name'
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            placeholder='Bank Worker E-Mail'
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
          <input
            type="tel"
            name="mobno"
            required
            pattern="[0-9]{10}"
            value={formData.mobno}
            onChange={handleChange}
            placeholder="10 digit number"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            placeholder='Bank Worker Address'
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Worker ID</label>
          <input
            type="text"
            name="workerId"
            required
            value={formData.workerId}
            onChange={handleChange}
            maxLength={12}
            placeholder="Worker Id (8 char) <BANKCODE(4) WRK Worker_No>"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Hidden inputs for branchId and branchManagerId */}
        <input type="hidden" name="branchId" value={formData.branchId} />
        <input type="hidden" name="branchManagerId" value={formData.branchManagerId} />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Add Worker
        </button>
      </form>
    </div>
  );
}

export default BranchManagerAddBankWorker;

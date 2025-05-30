import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function BankManagerAddBranchManager() {
  const navigate = useNavigate();

  // Form state including branchManagerId
  const [formData, setFormData] = useState({
    branchManagerId: '',
    name: '',
    email: '',
    mobno: '',
    address: '',
    password: '',
    branchId: '',
  });

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

useEffect(() => {
  const token = localStorage.getItem('bankmanager-token');
  if (!token) {
    navigate('/bankmanager'); // Redirect if no token for adding branch manager
    return;
  }

  fetch('http://localhost:5000/bankmanager/branches')
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch branches');
      return res.json();
    })
    .then((data) => {
      setBranches(data);
      setLoadingBranches(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoadingBranches(false);
    });
}, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    const token = localStorage.getItem('bankmanager-token');
    if (!token) {
      setError('You must be logged in');
      setSubmitting(false);
      navigate('/bankmanager');
      return;
    }

    const decoded = parseJwt(token);
    const bankManagerId = decoded?.id;

    const payload = {
      ...formData,
      bankManagerId,
    };

    try {
      const res = await fetch('http://localhost:5000/bankmanager/add-branchmanager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add branch manager');
      }

      setSuccessMsg('Branch manager added successfully');
      setFormData({
        branchManagerId: '',
        name: '',
        email: '',
        mobno: '',
        address: '',
        password: '',
        branchId: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBranches) return <p>Loading branches...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Branch Manager</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {successMsg && <p className="mb-4 text-green-600">{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Branch Manager ID:
          <input
            type="text"
            name="branchManagerId"
            value={formData.branchManagerId}
            onChange={handleChange}
            maxLength={8}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Manager ID 8 char <Bankcode(4) MGR MGRNo>"
          />
        </label>

        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter Branch Manager Name"

          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter Branch Manager E-Mail Id"
          />
        </label>

        <label className="block mb-2">
          Mobile No:
          <input
            type="tel"
            name="mobno"
            value={formData.mobno}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            placeholder="10 digit number"
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter Branch Manager Address"
          />
        </label>

        <label className="block mb-2">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder='Min : 6 char'
          />
        </label>

        <label className="block mb-4">
          Select Branch:
          <select
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            maxLength={12}
            required
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="" disabled>
              -- Select Branch --
            </option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName} ({branch.branchId})
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {submitting ? 'Adding...' : 'Add Branch Manager'}
        </button>
      </form>
    </div>
  );
}

export default BankManagerAddBranchManager;

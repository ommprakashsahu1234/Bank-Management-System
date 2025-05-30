import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BankManagerAddBranch() {
  const navigate = useNavigate();

  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [totalBalance, setTotalBalance] = useState("0");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bankmanager-token");
    if (!token) {
      navigate("/bankmanager"); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("bankmanager-token");
    if (!token) {
      setError("Please login to add branch details");
      navigate("/bankmanager");
      return;
    }

    const payload = {
      branchName,
      branchId,
      address,
      contactNumber,
      email,
      totalBalance: Number(totalBalance) || 0,
    };

    try {
      const res = await fetch("http://localhost:5000/bankmanager/add-branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        setError("Session expired or unauthorized. Please login again.");
        navigate("/bankmanager");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add branch");
        return;
      }

      setMessage("Branch added successfully!");
      setError("");
      setBranchName("");
      setBranchId("");
      setAddress("");
      setContactNumber("");
      setEmail("");
      setTotalBalance("0");
    } catch (err) {
      setError("Network error, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Branch Details</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
      )}
      {message && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Branch Name</label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter Branch Name"

          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Branch ID (IFSC)</label>
          <input
            type="text"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            maxLength={12}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Branch ID (12 Char)<BR.NO Year DateMonth>"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            placeholder="Enter Branch Address"

          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            pattern="[0-9]{10,15}"
            title="Enter a valid contact number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter Branch Contact no."

          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter Branch E-Mail"

          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Total Balance</label>
          <input
            type="number"
            value={totalBalance}
            onChange={(e) => setTotalBalance(e.target.value)}
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Branch
        </button>
      </form>
    </div>
  );
}

export default BankManagerAddBranch;

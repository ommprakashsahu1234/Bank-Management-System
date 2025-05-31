import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react"; // Bell icon

function AccountHolderDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accountHolder-token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:5000/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);

        fetch(
          `http://localhost:5000/notificationscount?receiverId=${data.accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(
                errorData.error || "Failed to fetch notifications count"
              );
            }
            return res.json();
          })
          .then((res) => {
            setUnreadCount(res.unreadCount);
          })
          .catch((err) => {
            console.error("Notification error:", err.message);
          });
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    setTxLoading(true);
    const token = localStorage.getItem("accountHolder-token");

    fetch(
      `http://localhost:5000/transactions/account/${userData.accountNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch transactions");
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        setTxLoading(false);
      })
      .catch(() => {
        setTxLoading(false);
      });
  }, [userData]);

  if (loading)
    return <div className="p-4 text-center">Loading user data...</div>;
  function handleLogout() {
    localStorage.removeItem('accountHolder-token');
    navigate('/login');
  }
  return (
    <div className="relative min-h-screen bg-gray-100 pb-10">
      <div className="absolute top-4 right-6">
        <Link to="/notifications" className="relative cursor-pointer">
          <Bell className="w-7 h-7 text-blue-900" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto bg-white rounded shadow mt-20">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Welcome, {userData.name}!
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300 rounded overflow-hidden">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Email</td>
                <td className="py-2 px-4">{userData.email}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Mobile</td>
                <td className="py-2 px-4">{userData.mobno}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Account Number</td>
                <td className="py-2 px-4">{userData.accountNumber}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Balance</td>
                <td className="py-2 px-4">₹{userData.balance.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Branch ID</td>
                <td className="py-2 px-4">{userData.branchId}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2 px-4 bg-gray-100">Address</td>
                <td className="py-2 px-4">{userData.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/transfer-money")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Transfer Money
          </button>
          <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="max-w-6xl mx-auto mt-12 p-4 sm:p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Transaction History
        </h2>

        {txLoading ? (
          <p className="text-center text-gray-600">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-600">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Type
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Doer
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    To / From
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-right">
                    Amount (₹)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Transaction ID
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 capitalize">
                      {tx.type}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 capitalize">
                      {tx.purpose}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {tx.counterpartyName || "BANK-PAYMENT"}
                    </td>
                    <td
                      className={`border border-gray-300 px-3 py-2 text-right font-semibold ${
                        tx.type === "sent" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {tx.type === "sent" ? "-" : "+"}
                      {tx.amount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 font-mono text-sm">
                      {tx.transactionId}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountHolderDashboard;

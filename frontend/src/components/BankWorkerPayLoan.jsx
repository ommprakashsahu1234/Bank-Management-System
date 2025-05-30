import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BankworkerPayLoan() {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState({}); // loanId -> amount

  const token = localStorage.getItem("bankworker-token");

  async function fetchLoans() {
    if (!accountNumber.trim()) {
      alert("Please enter an account number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/bankworker/loans/${accountNumber.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/bankworker");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to fetch loans.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLoans(data.loans || []);
    } catch (error) {
      alert("Error fetching loans");
    }
    setLoading(false);
  }

  function handleAmountChange(loanId, value) {
    if (value === "") {
      setPaymentAmounts((prev) => ({ ...prev, [loanId]: "" }));
      return;
    }
    const floatVal = parseFloat(value);
    if (isNaN(floatVal) || floatVal < 0) {
      return;
    }
    setPaymentAmounts((prev) => ({ ...prev, [loanId]: floatVal }));
  }

  async function handlePay(loan) {
    const unpaidAmount = loan.amountToBePaid - (loan.amountPaid || 0);
    const paymentAmount = paymentAmounts[loan.loanId];

    if (!paymentAmount || paymentAmount <= 0) {
      alert("Please enter a valid payment amount greater than 0.");
      return;
    }

    if (paymentAmount > unpaidAmount) {
      alert(`Payment cannot exceed unpaid amount of ${unpaidAmount.toFixed(2)}`);
      return;
    }

    const paymentMode = prompt(
      `Enter payment mode for Loan ${loan.loanId} (Cash, Online, etc.):`,
      "online"
    );
    if (!paymentMode) {
      alert("Payment mode is required.");
      return;
    }

    const remarks = prompt("Any remarks? (optional)", "");

    try {
      const res = await fetch("http://localhost:5000/bankworker/pay-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          loanId: loan.loanId,
          paymentAmount,
          paymentMode,
          remarks,
        }),
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/bankworker");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment failed.");
        return;
      }

      alert("Payment successful!");
      fetchLoans();
      setPaymentAmounts((prev) => ({ ...prev, [loan.loanId]: "" }));
    } catch (err) {
      alert("Error submitting payment.");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Pay Loan By Account Number</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded flex-grow"
        />
        <button
          onClick={fetchLoans}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search Loans
        </button>
      </div>

      {loading && <div>Loading loans...</div>}

      {loans.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Loan ID</th>
                <th className="border px-4 py-2">Purpose</th>
                <th className="border px-4 py-2">Amount To Be Paid</th>
                <th className="border px-4 py-2">Amount Paid</th>
                <th className="border px-4 py-2">Unpaid Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Payment Amount</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const unpaidAmount = loan.amountToBePaid - (loan.amountPaid || 0);
                const isActive = unpaidAmount > 0 && loan.status !== "closed";
                return (
                  <tr key={loan.loanId}>
                    <td className="border px-4 py-2">{loan.loanId}</td>
                    <td className="border px-4 py-2">{loan.purpose}</td>
                    <td className="border px-4 py-2">
                      {loan.amountToBePaid.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {(loan.amountPaid || 0).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">{unpaidAmount.toFixed(2)}</td>
                    <td className="border px-4 py-2">{loan.status}</td>
                    <td className="border px-4 py-2">
                      {isActive ? (
                        <input
                          type="number"
                          min="0"
                          max={unpaidAmount}
                          step="0.01"
                          value={paymentAmounts[loan.loanId] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (
                              val === "" ||
                              (parseFloat(val) >= 0 && parseFloat(val) <= unpaidAmount)
                            ) {
                              handleAmountChange(loan.loanId, val);
                            }
                          }}
                          placeholder="Enter payment"
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {isActive ? (
                        <button
                          onClick={() => handlePay(loan)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Pay
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {loans.length === 0 && !loading && (
        <p className="text-gray-500">No loans found for this account number.</p>
      )}
    </div>
  );
}

export default BankworkerPayLoan;

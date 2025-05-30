import React, { useEffect, useState } from "react";

function BranchManagerSeeLoans() {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("bm-token");
        const loansRes = await fetch("http://localhost:5000/branchmanager/see-loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!loansRes.ok) {
          const text = await loansRes.text();
          throw new Error(text || "Error fetching loans");
        }
        const loansData = await loansRes.json();

        const paymentsRes = await fetch("http://localhost:5000/branchmanager/loanpayments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!paymentsRes.ok) {
          const text = await paymentsRes.text();
          throw new Error(text || "Error fetching payments");
        }
        const paymentsData = await paymentsRes.json();

        setLoans(loansData);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Map loanId to total paid amount
  const paidMap = payments.reduce((acc, payment) => {
    acc[payment.loanId] = (acc[payment.loanId] || 0) + payment.paymentAmount;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Loans of Your Branch</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {/* Responsive horizontal scroll container */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-[900px] border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1 whitespace-nowrap">Branch ID</th>
              <th className="border px-2 py-1 whitespace-nowrap">Loan ID</th>
              <th className="border px-2 py-1 whitespace-nowrap">Account No.</th>
              <th className="border px-2 py-1 whitespace-nowrap">Parent Amount</th>
              <th className="border px-2 py-1 whitespace-nowrap">To Be Paid</th>
              <th className="border px-2 py-1 whitespace-nowrap">Unpaid</th>
              <th className="border px-2 py-1 whitespace-nowrap">Purpose</th>
              <th className="border px-2 py-1 whitespace-nowrap">Applied</th>
              <th className="border px-2 py-1 whitespace-nowrap">Approved</th>
              <th className="border px-2 py-1 whitespace-nowrap">Disbursed</th>
              <th className="border px-2 py-1 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, i) => {
              const totalPaid = paidMap[loan.loanId] || 0;
              const unpaidAmount = loan.amountToBePaid - totalPaid;
              return (
                <tr key={i} className="text-center even:bg-gray-50">
                  <td className="border px-2 py-1">{loan.branchId}</td>
                  <td className="border px-2 py-1">{loan.loanId}</td>
                  <td className="border px-2 py-1">{loan.accountHolderNumber}</td>
                  <td className="border px-2 py-1">₹{loan.parentAmount}</td>
                  <td className="border px-2 py-1">₹{loan.amountToBePaid}</td>
                  <td className="border px-2 py-1 text-red-600 font-semibold">₹{unpaidAmount}</td>
                  <td className="border px-2 py-1">{loan.purpose}</td>
                  <td className="border px-2 py-1">{loan.applicationDate?.slice(0, 10)}</td>
                  <td className="border px-2 py-1">{loan.approvalDate?.slice(0, 10) || "-"}</td>
                  <td className="border px-2 py-1">{loan.disbursementDate?.slice(0, 10) || "-"}</td>
                  <td className="border px-2 py-1">{loan.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BranchManagerSeeLoans;

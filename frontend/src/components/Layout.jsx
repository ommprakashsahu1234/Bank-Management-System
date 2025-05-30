import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import AddSuggestions from "./AddSuggestions";

import AccountHolderDashboard from "./AccountHolderDashboard";
import AccountHolderLogin from "./AccountHolderLogin";
import AccountHolderTransferAmount from "./AccountHolderTransferAmount";
import AccountHolderSeeNotifications from "./AccountHolderSeeNotifications";

import BankWorkerDashboard from "./BankWorkerDashboard";
import BankWorkerLogin from "./BankWorkerLogin";
import BankWorkerRequestLoan from "./BankWorkerRequestLoan";
import BankWorkerPayLoan from "./BankWorkerPayLoan";
import BankWorkerTransferMoney from "./BankWorkerTransferMoney";
import BankWokerCreateAccountHolder from './BankWokerCreateAccountHolder'
import BankWorkerDepositAmount from "./BankWorkerDepositAmount";

import BranchManagerDashboard from "./BranchManagerDashboard";
import BranchManagerEditWorkers from "./BranchManagerEditWorkers";
import BranchManagerLogin from "./BranchManagerLogin";
import BranchManagerReviewLoan from "./BranchManagerReviewLoan";
import BranchManagerAddBankWorker from './BranchManagerAddBankWorker'
import BranchManagerSeeLoans from './BranchManagerSeeLoans'
import BranchManagerGetAccountHolderDetails from "./BranchManagerGetAccountHolderDetails";

import BankManagerDashboard from "./BankManagerDashboard";
import BankManagerAddBranchManager from "./BankManagerAddBranchManager";
import BankManagerEditBranchManager from "./BankManagerEditBranchManager";  
import BankManagerLogin from "./BankManagerLogin";
import BankManagerAddBranch from "./BankManagerAddBranch";

import About from './About'
import Err404 from "./Err404";
import Header from './HeaderFooter/Header';
import Footer from './HeaderFooter/Footer';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}




function Frame() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AccountHolderDashboard/>} />
          <Route path="/login" element={<AccountHolderLogin />} />
          <Route path="transfer-money" element={<AccountHolderTransferAmount />} />
          <Route path="notifications" element={<AccountHolderSeeNotifications />} />
        </Route>

        
        <Route path="/bankworker" element={<Layout />}>
          <Route index element={<BankWorkerLogin />} />
          <Route path="dashboard" element={<BankWorkerDashboard />} />
          <Route path="request-loan" element={<BankWorkerRequestLoan />} />
          <Route path="pay-loan" element={<BankWorkerPayLoan />} />
          <Route path="create-account-holder" element={<BankWokerCreateAccountHolder />} />
          <Route path="transfer-money" element={<BankWorkerTransferMoney />} />
          <Route path="deposit-money" element={<BankWorkerDepositAmount />} />
        </Route>

        
        <Route path="/branchmanager" element={<Layout />}>
          <Route index element={<BranchManagerLogin />} />
          <Route path="dashboard" element={<BranchManagerDashboard />} />
          <Route path="review-loans" element={<BranchManagerReviewLoan />} />
          <Route path="review-loans/:loanId" element={<BranchManagerReviewLoan />} />
          <Route path="delete-workers" element={<BranchManagerEditWorkers />} />
          <Route path="add-bankworker" element={<BranchManagerAddBankWorker />} />
          <Route path="see-loans" element={<BranchManagerSeeLoans />} />
          <Route path="accountholderdetails" element={<BranchManagerGetAccountHolderDetails />} />

        </Route>

        
        <Route path="/bankmanager" element={<Layout />}>
          <Route index element={<BankManagerLogin />} />
          <Route path="dashboard" element={<BankManagerDashboard />} />
          <Route path="add-branch" element={<BankManagerAddBranch />} />
          <Route path="add-branchmanager" element={<BankManagerAddBranchManager />} />
          <Route path="delete-branchmanagers" element={<BankManagerEditBranchManager />} />
        </Route>  

        
        <Route path="/about" element={<About />} />
        <Route path="add-suggestion" element={<AddSuggestions />} />
        <Route path="*" element={<Err404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Frame;

import React from 'react';

function About() {
  return (
    <div className="min-h-[85vh] bg-[#f4f7fa] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6 text-center">
          About Bank Management System
        </h1>
        
        <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
          The <strong>Bank Management System</strong> is a full-stack, role-based web application designed to streamline the operations of a banking environment. Built using <strong>MERN (MongoDB, Express.js, React, Node.js)</strong> and Firebase for authentication and cloud services, this platform manages multiple roles with different levels of access:
        </p>

        <ul className="list-disc list-inside my-4 text-gray-700 text-base sm:text-lg space-y-2">
          <li><strong>Account Holder</strong>: Can view account details, transaction history, transfer money, and receive notifications.</li>
          <li><strong>Bank Worker</strong>: Can manage account creation, submit loan applications, and handle loan payments.</li>
          <li><strong>Branch Manager</strong>: Can view all loans and loan payments of the branch, and track account holders.</li>
          <li><strong>Bank Manager</strong>: Holds full administrative privileges across all branches, workers, and users.</li>
        </ul>

        <p className="text-gray-700 text-base sm:text-lg mb-4">
          The system supports key features such as:
        </p>

        <ul className="list-disc list-inside text-gray-700 text-base sm:text-lg space-y-2 mb-4">
          <li>JWT-based secure authentication and role-based authorization</li>
          <li>Account creation with custom auto-generated account numbers</li>
          <li>Money transfers between account holders with transaction tracking</li>
          <li>Loan application and payment tracking system</li>
          <li>Real-time notification system for updates and alerts</li>
        </ul>

        <p className="text-gray-700 text-base sm:text-lg mb-4">
          This system was built with a focus on simplicity, clarity, and security while allowing future scalability. It's designed to be responsive and mobile-friendly using <strong>Tailwind CSS</strong>, ensuring a smooth experience across devices.
        </p>

        <p className="text-gray-700 text-base sm:text-lg mb-6">
          The project not only serves as a practical banking simulation but also demonstrates advanced features like backend validation, relational data management using MongoDB, and structured component-based design with React.
        </p>
      </div>
    </div>
  );
}

export default About;

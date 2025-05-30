import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccountHolderSeeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accountHolder-token');
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch user data to get account number
    fetch('http://localhost:5000/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(userData => {
        const accountNumber = userData.accountNumber;

        // 1. Mark all unread as read
        fetch('http://localhost:5000/notifications/mark-read', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverId: accountNumber }),
        });

        return fetch(`http://localhost:5000/notifications?receiverId=${accountNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notifications:', err);
        navigate('/login');
      });
  }, [navigate]);

  if (loading) return <div className="p-6 text-center">Loading notifications...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Your Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-600">No notifications available.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded shadow border ${
                notification.isRead ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <div className="font-semibold text-blue-900">{notification.purpose || 'General'}</div>
              <div className="text-gray-700 mt-1">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccountHolderSeeNotifications;

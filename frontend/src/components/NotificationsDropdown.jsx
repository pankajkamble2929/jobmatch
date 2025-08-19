// src/components/NotificationsDropdown.jsx
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationProvider';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown() {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative ml-4">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <h4 className="p-2 font-bold border-b">Notifications</h4>
          <ul className="max-h-64 overflow-y-auto">
            {notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((n) => (
                <li
                  key={n._id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    !n.read ? 'font-semibold' : ''
                  }`}
                  onClick={() => {
                    markAsRead(n._id);
                    setOpen(false); // close dropdown
                  }}
                >
                  {n.message}
                </li>
              ))}
          </ul>
          <div className="text-center border-t p-2">
            <Link
              to="/notifications"
              className="text-sm text-pastelBlue-700 font-medium"
            >
              See All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

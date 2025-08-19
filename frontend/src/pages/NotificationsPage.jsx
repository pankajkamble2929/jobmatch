// src/pages/NotificationsPage.jsx
import { useNotifications } from '../context/NotificationProvider';

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  ];

  const month = date.toLocaleString("en-US", { month: "short" }); // Aug
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${suffix} ${month} ${year} ${time}`;
}

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotifications();

  if (notifications.length === 0)
    return <p className="p-10">No notifications yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
              !n.read ? 'bg-gray-100' : ''
            }`}
            onClick={() => markAsRead(n._id)}
          >
            <p>{n.message}</p>
            <p className="text-xs text-gray-500">
              {n.createdAt ? formatDate(n.createdAt) : ''}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

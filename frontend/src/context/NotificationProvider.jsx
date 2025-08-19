// src/context/NotificationProvider.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthProvider";
import { SOCKET_URL } from "../config";
import api from "../utils/axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) return; // ✅ check token, not user?.token

    // Set default Authorization header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // Initialize socket connection
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
    });

    socketInstance.emit("registerUser", user._id);

    socketInstance.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, token, authLoading]);

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

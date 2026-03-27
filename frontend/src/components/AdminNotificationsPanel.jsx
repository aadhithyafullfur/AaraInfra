import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function AdminNotificationsPanel() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const pushNotification = (entry) => {
      setNotifications((prev) => [entry, ...prev].slice(0, 20));
    };

    const onAdminNotification = (payload) => {
      pushNotification({
        id: `${Date.now()}-${Math.random()}`,
        title: payload.title || "Notification",
        message: payload.message || "",
        createdAt: payload.createdAt || new Date().toISOString(),
      });
    };

    const onClientLoggedIn = (client) => {
      pushNotification({
        id: `${Date.now()}-${Math.random()}`,
        title: "New Client Activity",
        message: `${client?.name || "A client"} logged in`,
        createdAt: new Date().toISOString(),
      });
    };

    const onNewOrder = (order) => {
      pushNotification({
        id: `${Date.now()}-${Math.random()}`,
        title: "New Order Received",
        message: `${order?.clientName || order?.user?.name || "Client"} placed ${order?.orderId || "an order"}`,
        createdAt: new Date().toISOString(),
      });
    };

    const onOrderUpdated = ({ orderId, status }) => {
      pushNotification({
        id: `${Date.now()}-${Math.random()}`,
        title: "Order Updated",
        message: `Order #${orderId.substring(orderId.length - 8).toUpperCase()} was marked as ${status}`,
        createdAt: new Date().toISOString(),
      });
    };

    socket.on("adminNotification", onAdminNotification);
    socket.on("clientLoggedIn", onClientLoggedIn);
    socket.on("newOrder", onNewOrder);
    socket.on("orderUpdated", onOrderUpdated);

    return () => {
      socket.off("adminNotification", onAdminNotification);
      socket.off("clientLoggedIn", onClientLoggedIn);
      socket.off("newOrder", onNewOrder);
      socket.off("orderUpdated", onOrderUpdated);
    };
  }, [socket]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
      <div className="mt-4 space-y-3 max-h-72 overflow-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No live notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

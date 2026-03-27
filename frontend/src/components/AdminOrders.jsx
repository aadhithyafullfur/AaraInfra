import { useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../utility/api";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { socket } = useSocket();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      setOrders((prev) => {
        if (prev.some((item) => item._id === newOrder._id)) return prev;
        return [newOrder, ...prev];
      });
      toast.success("New Order Received", { icon: "🛎️" });
    };

    const handleOrderUpdated = ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((item) =>
          item._id === orderId ? { ...item, status } : item
        )
      );
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderReceived", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdated);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderReceived", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdated);
    };
  }, [socket]);

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return orders;

    return orders.filter((order) => {
      const orderNo = String(order.orderId || "").toLowerCase();
      const client = String(order.clientName || order.user?.name || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();
      return orderNo.includes(normalized) || client.includes(normalized) || status.includes(normalized);
    });
  }, [orders, query]);

  const onStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((item) => (item._id === orderId ? { ...item, status } : item)));
      toast.success(`Order ${status}`);
    } catch (error) {
      toast.error(error?.message || `Failed to mark as ${status}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage pending client orders in real time.</p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order ID, client, status"
          className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700/50">
              <tr>
                <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Order ID</th>
              <th className="px-6 py-4 text-xs uppercase text-gray-500">Client Name</th>
              <th className="px-6 py-4 text-xs uppercase text-gray-500">Product Details</th>
              <th className="px-6 py-4 text-xs uppercase text-gray-500">Total Price</th>
              <th className="px-6 py-4 text-xs uppercase text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs uppercase text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500" colSpan="6">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500" colSpan="6">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{order.orderId || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{order.clientName || order.user?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {(order.items || []).map((item) => `${item.name} x${item.quantity}`).join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">₹{Number(order.totalPrice || order.totalAmount || 0).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{order.status}</td>
                  <td className="px-6 py-4 text-right">
                    {order.status === "Pending" ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onStatusUpdate(order._id, "Accepted")}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 transition-colors shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onStatusUpdate(order._id, "Rejected")}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 transition-colors shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Action taken</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

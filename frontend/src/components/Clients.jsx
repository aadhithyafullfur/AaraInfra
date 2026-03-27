import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const { socket } = useSocket();

  const loadClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.message || "Unable to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const upsertClient = (client) => {
      if (!client?._id) return;
      setClients((prev) => {
        const idx = prev.findIndex((entry) => entry._id === client._id);
        if (idx === -1) return [client, ...prev];

        const next = [...prev];
        next[idx] = { ...next[idx], ...client };
        return next;
      });
    };

    const handleClientLoggedIn = (client) => {
      upsertClient(client);
      toast.success(`New Client Activity: ${client?.name || "Client"}`, { icon: "🧑‍💼" });
    };

    const handleNewClient = (client) => {
      upsertClient(client);
    };

    socket.on("clientLoggedIn", handleClientLoggedIn);
    socket.on("newClient", handleNewClient);

    return () => {
      socket.off("clientLoggedIn", handleClientLoggedIn);
      socket.off("newClient", handleNewClient);
    };
  }, [socket]);

  const filteredClients = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return clients;

    return clients.filter((client) => {
      const name = String(client?.name || "").toLowerCase();
      const email = String(client?.email || "").toLowerCase();
      const phone = String(client?.phone || "").toLowerCase();
      const address = String(client?.address || "").toLowerCase();
      const gstin = String(client?.gstin || "").toLowerCase();
      return name.includes(key) || email.includes(key) || phone.includes(key) || address.includes(key) || gstin.includes(key);
    });
  }, [clients, search]);

  const formatDateTime = (value, fallback = "-") => {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
  };

  const renderHistory = (client) => {
    const history = Array.isArray(client?.activityHistory) ? client.activityHistory : [];

    if (history.length === 0) {
      return <p className="text-xs text-gray-500 dark:text-gray-400">No activity yet.</p>;
    }

    return (
      <ul className="space-y-2">
        {history.map((event, index) => (
          <li
            key={`${client._id}-${event.createdAt || "no-date"}-${index}`}
            className="flex items-start justify-between gap-4 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{event.description || "Activity"}</p>
              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{event.eventType || "event"}</p>
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDateTime(event.createdAt, "-")}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All registered and logged-in clients.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, address, GSTIN"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Registered</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Support</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500" colSpan="8">Loading clients...</td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-sm text-gray-500" colSpan="8">No clients found.</td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const isExpanded = expandedClientId === client._id;

                return (
                  <Fragment key={client._id}>
                    <tr>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{client.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.email || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDateTime(client.createdAt, "-")}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {formatDateTime(client.lastLogin, "Never")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.totalOrders || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{client.totalSupportMessages || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedClientId((prev) => (prev === client._id ? null : client._id))}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {isExpanded ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50/70 dark:bg-gray-900/30">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Client Info</h3>
                              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                <p><span className="font-medium">Address:</span> {client.address || "N/A"}</p>
                                <p><span className="font-medium">GSTIN:</span> {client.gstin || "N/A"}</p>
                                <p><span className="font-medium">State:</span> {client.state || "N/A"} {client.stateCode ? `(${client.stateCode})` : ""}</p>
                                <p><span className="font-medium">Last Order:</span> {formatDateTime(client.lastOrderAt, "-")}</p>
                                <p><span className="font-medium">Last Support:</span> {formatDateTime(client.lastSupportAt, "-")}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Client History</h3>
                              {renderHistory(client)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

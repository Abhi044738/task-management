import { useEffect, useState } from "react";
import api from "../services/api";
import { getSocket, connectSocket } from "../services/socket";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  const load = async () => {
    try {
      const res = await api.getNotifications();
      if (res?.data?.success) setNotifs(res.data.data);
      else setNotifs(res.data || []);
    } catch (err) {
      console.error("Load notifs", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();

    const socket = getSocket() ?? connectSocket(token);
    if (!socket) return;

    const onNotif = (n) => {
      setNotifs((prev) => [n, ...prev]);
    };
    socket.on("notification", onNotif);
    return () => {
      socket.off("notification", onNotif);
    };
  }, [token]);

  const markRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifs((n) => n.map((x) => (x._id === id ? { ...x, read: true } : x)));
    } catch (err) {
      console.error(err);
    }
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded hover:bg-gray-700"
        aria-label="notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
          <div className="p-3">
            <h4 className="font-semibold">Notifications</h4>
          </div>
          <div className="max-h-64 overflow-auto divide-y divide-gray-700">
            {notifs.length === 0 && (
              <div className="p-3 text-sm text-gray-400">No notifications</div>
            )}
            {notifs.map((n) => (
              <div
                className="p-3 flex justify-between items-start"
                key={n.id ?? n._id}
              >
                <div>
                  <div className="text-sm">{n.message ?? n.msg}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(
                      n.createdAt || n.ts || Date.now()
                    ).toLocaleString()}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="ml-4 text-xs bg-blue-600 px-2 py-1 rounded"
                  >
                    Mark
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

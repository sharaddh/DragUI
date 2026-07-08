import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Info, AlertTriangle, ExternalLink } from "lucide-react";

const ICONS = { info: Info, success: Check, warning: AlertTriangle };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    import("../api/notifications").then(({ getNotifications }) => {
      getNotifications().then((res) => {
        setNotifications(res.data.notifications || []);
      }).catch(() => {
        setNotifications([]);
      }).finally(() => setLoading(false));
    });
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unread > 0 && (
              <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700">Mark all read</button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n, i) => {
                  const Icon = ICONS[n.type] || Info;
                  return (
                    <div key={n._id || i} className={`flex gap-3 px-4 py-3 transition hover:bg-slate-50 ${n.read ? "" : "bg-cyan-50/30"}`}>
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-slate-100 text-slate-400" : "bg-cyan-100 text-cyan-600"}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900">{n.title || "Notification"}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message || n.body || ""}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2.5 text-center">
            <button className="text-xs font-medium text-slate-500 hover:text-slate-700">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

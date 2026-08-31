"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  CalendarDays,
  ClipboardList,
  Sparkles,
  Check,
  Clock,
  AlertCircle,
  Video,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchLiveNotifications();
  }, []);

  const fetchLiveNotifications = async () => {
    try {
      setLoading(true);

      const [taskRes, meetingRes] = await Promise.allSettled([
        axios.get("http://localhost:5000/api/Task"),
        axios.get("http://localhost:5000/api/Meeting"),
      ]);

      const items = [];

      if (taskRes.status === "fulfilled" && Array.isArray(taskRes.value?.data?.data)) {
        taskRes.value.data.data.forEach((t, idx) => {
          items.push({
            id: `task-${t._id || idx}`,
            type: "Task",
            title: `Assigned Task: ${t.title || "New Task"}`,
            description: t.description || `Priority: ${t.priority || "Normal"} | Status: ${t.status || "Pending"}`,
            timestamp: t.dueDate ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : "Active Task",
            read: false,
          });
        });
      }

      if (meetingRes.status === "fulfilled" && Array.isArray(meetingRes.value?.data?.data)) {
        meetingRes.value.data.data.forEach((m, idx) => {
          items.push({
            id: `meeting-${m._id || idx}`,
            type: "Meeting",
            title: `Meeting Schedule: ${m.title || "Team Sync"}`,
            description: `${m.startTime || ""} - ${m.endTime || ""} (${m.meetingType || "Online"})`,
            timestamp: m.meetingDate ? new Date(m.meetingDate).toLocaleDateString() : "Scheduled",
            read: false,
            link: m.meetingLink,
          });
        });
      }

      setNotifications(items);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (n.title || "").toLowerCase().includes(searchLower) ||
      (n.description || "").toLowerCase().includes(searchLower);

    const matchesType =
      filterType === "ALL" || n.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-3">
              <Bell size={13} />
              <span>NOTIFICATIONS & UPDATES</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Activity Alerts ({unreadCount} New)
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Stay informed on task updates, meeting invitations, and corporate announcements.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
            >
              <Check size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notification message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Alerts</option>
            <option value="Task">Tasks</option>
            <option value="Meeting">Meetings</option>
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden divide-y divide-slate-100">
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600 mx-auto" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Syncing notification stream...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No Notifications</p>
            <p className="text-xs text-slate-400 mt-1">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleToggleRead(n.id)}
              className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !n.read ? "bg-cyan-50/20 hover:bg-cyan-50/40" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    n.type === "Meeting"
                      ? "bg-cyan-50 text-cyan-600 border border-cyan-100"
                      : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                  }`}
                >
                  {n.type === "Meeting" ? <CalendarDays size={20} /> : <ClipboardList size={20} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{n.description}</p>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-2 flex items-center gap-1">
                    <Clock size={11} /> {n.timestamp}
                  </span>
                </div>
              </div>

              {n.link && (
                <a
                  href={n.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 font-bold text-xs shadow-xs transition"
                >
                  Join
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

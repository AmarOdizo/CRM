"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Mail,
  Briefcase,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function UserNavbar({ collapsed, setCollapsed }) {
  const router = useRouter();

  // Dropdown States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Live Employee State
  const [userProfile, setUserProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Live Notifications State (fetched from database tables)
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load live employee profile & system activity from database
  useEffect(() => {
    async function loadNavbarData() {
      try {
        setLoadingUser(true);
        let currentEmployee = null;

        // 1. Try reading logged-in session from localStorage
        if (typeof window !== "undefined") {
          const storedEmp = localStorage.getItem("employee") || localStorage.getItem("user");
          if (storedEmp) {
            try {
              currentEmployee = JSON.parse(storedEmp);
            } catch (e) {
              console.error("Session parse error:", e);
            }
          }
        }

        // 2. Fetch directly from Employee table if session is missing
        if (!currentEmployee || !currentEmployee.name) {
          const empRes = await axios.get("http://localhost:5000/api/Employee");
          if (empRes.data && empRes.data.data && empRes.data.data.length > 0) {
            currentEmployee = empRes.data.data[0];
          }
        }

        if (currentEmployee) {
          setUserProfile({
            id: currentEmployee._id || currentEmployee.id,
            name: currentEmployee.name || currentEmployee.fullName || "Employee",
            email: currentEmployee.email || "employee@crm.com",
            phone: currentEmployee.phone || "",
            designation: currentEmployee.designation || "Staff Member",
            department: currentEmployee.department || "General",
            employeeId: currentEmployee.employeeid || currentEmployee.employeeId || "EMP001",
          });
        }

        // 3. Fetch real notifications from database Task & Meeting tables
        const [taskRes, meetingRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/Task"),
          axios.get("http://localhost:5000/api/Meeting"),
        ]);

        const liveNotifications = [];

        if (taskRes.status === "fulfilled" && taskRes.value?.data?.data) {
          const tasks = taskRes.value.data.data;
          tasks.slice(0, 3).forEach((t, idx) => {
            liveNotifications.push({
              id: `task-${t._id || idx}`,
              title: `Task: ${t.title || "Assigned Task"}`,
              desc: `Priority: ${t.priority || "Normal"} | Status: ${t.status || "Pending"}`,
              time: t.dueDate ? `Due: ${new Date(t.dueDate).toLocaleDateString()}` : "Active",
              read: false,
            });
          });
        }

        if (meetingRes.status === "fulfilled" && meetingRes.value?.data?.data) {
          const meetings = meetingRes.value.data.data;
          const empName = (currentEmployee?.name || currentEmployee?.fullName || "").toLowerCase();
          const empEmail = (currentEmployee?.email || "").toLowerCase();

          const myMeetingInvites = meetings.filter((m) => {
            if (!m.participants || !Array.isArray(m.participants) || m.participants.length === 0) return true;
            return m.participants.some((p) => {
              const pName = (p.name || "").toLowerCase();
              const pEmail = (p.email || "").toLowerCase();
              return (
                (empName && pName.includes(empName)) ||
                (empEmail && pEmail.includes(empEmail)) ||
                (pName && empName.includes(pName))
              );
            });
          });

          myMeetingInvites.slice(0, 3).forEach((m, idx) => {
            liveNotifications.push({
              id: `mtg-${m._id || idx}`,
              title: `Meeting Invite: ${m.title || "Scheduled Meeting"}`,
              desc: `${m.startTime || ""} (${m.meetingType || "Online"}) - ${m.meetingDate ? new Date(m.meetingDate).toLocaleDateString("en-IN") : ""}`,
              time: "Assigned to You",
              read: false,
            });
          });
        }

        setNotifications(liveNotifications);
      } catch (err) {
        console.error("Error fetching navbar employee data:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    loadNavbarData();
  }, []);

  // Click outside listener to dismiss popups
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileOpen && !event.target.closest("#user-profile-popover")) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !event.target.closest("#user-notifications-popover")) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen, notificationsOpen]);

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("employee");
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Get Avatar Initials
  const getInitials = (nameStr) => {
    if (!nameStr) return "E";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr[0].toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-40 transition-all duration-300
      ${collapsed ? "left-0 md:left-16" : "left-0 md:left-72"}`}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all border border-slate-200 bg-white shadow-sm shrink-0 active:scale-95 cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu
            size={18}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-90" : ""
            }`}
          />
        </button>

        <div className="leading-tight">
          <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>Employee Hub</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100/60">
              <Sparkles size={10} className="animate-spin" /> LIVE
            </span>
          </h2>
          <p className="text-slate-500 text-[11px] font-medium hidden sm:block">
            {loadingUser ? (
              "Loading profile..."
            ) : (
              <>
                Welcome back, <span className="font-bold text-slate-700">{userProfile?.name?.split(" ")[0]}</span> 👋
              </>
            )}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3.5 sm:gap-5">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search tasks, projects, meetings..."
            className="w-64 lg:w-72 h-10 rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 outline-none text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all shadow-inner"
          />
        </div>

        {/* NOTIFICATIONS DROPDOWN */}
        <div id="user-notifications-popover" className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2.5 rounded-xl border transition-all shrink-0 active:scale-95 cursor-pointer
            ${
              notificationsOpen
                ? "bg-slate-100 border-slate-300 text-slate-800"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-xs"
            }`}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* NOTIFICATIONS LIST POPOVER */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200/80 bg-white shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Bell size={14} className="text-cyan-600" />
                  <span className="text-xs font-extrabold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-extrabold text-cyan-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-cyan-600 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Check size={10} /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">
                    No new activity notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex gap-2.5 items-start hover:bg-slate-50 transition-colors ${
                        !n.read ? "bg-cyan-50/20" : ""
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                          !n.read ? "bg-cyan-500" : "bg-transparent"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-snug">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.desc}</p>
                        <span className="text-[9px] font-semibold text-slate-400 block mt-1">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/User1/dashboard"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-bold text-slate-400 hover:text-cyan-600 transition-colors block py-1"
                >
                  View All Activity
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE POPUP DROPDOWN */}
        <div id="user-profile-popover" className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-3 border-l border-slate-200 shrink-0 transition-all hover:opacity-90 active:scale-98 cursor-pointer select-none"
          >
            {/* Initials Avatar */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-md border border-cyan-400/20 shrink-0">
              {getInitials(userProfile?.name)}
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-extrabold text-slate-800">
                {userProfile?.name || "Employee"}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                {userProfile?.designation || "Staff Member"}
              </span>
            </div>

            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {/* USER PROFILE CARD POPUP */}
          {profileOpen && userProfile && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200/80 bg-white shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-3 border-b border-slate-100 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-xs font-black text-cyan-600 shrink-0">
                    {getInitials(userProfile.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-800 truncate">
                      {userProfile.name}
                    </h4>
                    <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100/60 inline-block">
                      {userProfile.employeeId}
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={12} className="text-slate-400 shrink-0" />
                    <span>{userProfile.department}</span>
                  </div>
                </div>
              </div>

              <div className="px-2 py-2 flex flex-col gap-0.5">
                <Link
                  href="/User1/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                >
                  <User size={14} className="text-slate-400" />
                  <span>My Profile & Worklog</span>
                </Link>
              </div>

              <div className="px-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold transition cursor-pointer"
                >
                  <LogOut size={14} className="text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

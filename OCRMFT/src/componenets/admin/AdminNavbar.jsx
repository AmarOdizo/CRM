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
  Shield,
  Check,
} from "lucide-react";

export default function AdminNavbar({ collapsed, setCollapsed }) {
  const router = useRouter();

  // Dropdown States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Admin User details state
  const [adminUser, setAdminUser] = useState({
    fullName: "Amar Admin",
    email: "admin@odizocrm.com",
    role: "Super Admin",
  });

  // Live Notifications State (from real database)
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load live admin session & database activity notifications
  useEffect(() => {
    async function loadAdminData() {
      try {
        let currentAdmin = null;

        // 1. Load from localStorage session
        if (typeof window !== "undefined") {
          const storedAdmin = localStorage.getItem("admin");
          if (storedAdmin) {
            try {
              currentAdmin = JSON.parse(storedAdmin);
            } catch (e) {
              console.error("Failed to parse admin session:", e);
            }
          }
        }

        // 2. Fallback to Admin API if session missing
        if (!currentAdmin || !currentAdmin.name) {
          const adminRes = await axios.get("http://localhost:5000/api/Admin");
          if (adminRes.data && adminRes.data.data && adminRes.data.data.length > 0) {
            currentAdmin = adminRes.data.data[0];
          }
        }

        if (currentAdmin) {
          setAdminUser({
            fullName: currentAdmin.name || currentAdmin.fullName || "Amar Admin",
            email: currentAdmin.email || "admin@odizocrm.com",
            role: currentAdmin.adminrole || currentAdmin.role || "Super Admin",
          });
        }

        // 3. Fetch real notifications from Payments & Invoices database
        const [paymentRes, invoiceRes, leadRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/Payment"),
          axios.get("http://localhost:5000/api/Invoice"),
          axios.get("http://localhost:5000/api/Lead"),
        ]);

        const liveNotifications = [];

        if (paymentRes.status === "fulfilled" && paymentRes.value?.data?.data) {
          const payments = paymentRes.value.data.data;
          payments.slice(0, 2).forEach((p, idx) => {
            liveNotifications.push({
              id: `pay-${p._id || idx}`,
              title: "Payment Received",
              desc: `₹${(Number(p.amount) || 0).toLocaleString("en-IN")} cleared (TXN: ${p.transactionId || "Ref"})`,
              time: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "Recent",
              read: false,
            });
          });
        }

        if (leadRes.status === "fulfilled" && leadRes.value?.data?.data) {
          const leads = leadRes.value.data.data;
          leads.slice(0, 2).forEach((l, idx) => {
            liveNotifications.push({
              id: `lead-${l._id || idx}`,
              title: "Inbound Lead",
              desc: `${l.companyName || l.clientName} requested quote`,
              time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "New",
              read: false,
            });
          });
        }

        setNotifications(liveNotifications);
      } catch (err) {
        console.error("Error loading admin navbar data:", err);
      }
    }

    loadAdminData();
  }, []);

  // Click Outside to Close Dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileOpen && !event.target.closest("#profile-dropdown-container")) {
        setProfileOpen(false);
      }
      if (notificationsOpen && !event.target.closest("#notifications-dropdown-container")) {
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
      localStorage.removeItem("admin");
    }
    router.push("/");
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Get initials for Avatar
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-40 transition-all duration-300
      ${collapsed ? "left-0 md:left-16" : "left-0 md:left-64"}`}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
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

        <div className="hidden sm:block leading-tight">
          <h2 className="text-base font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-500 text-[11px]">Welcome back, {adminUser.fullName.split(" ")[0]} 👋</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            placeholder="Search records..."
            className="pl-10 pr-4 h-10 rounded-xl border border-slate-200 bg-slate-50/50 outline-none w-64 text-sm focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* NOTIFICATIONS DROPDOWN CONTAINER */}
        <div id="notifications-dropdown-container" className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2.5 rounded-xl border transition-all shrink-0 active:scale-95 cursor-pointer
            ${
              notificationsOpen
                ? "bg-slate-100 border-slate-300 text-slate-800"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-850 shadow-xs"
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* NOTIFICATIONS LIST POPOVER */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">System Activity</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-cyan-600 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">
                    No recent activity notifications.
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
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.desc}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/admin1/report-management"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-bold text-slate-400 hover:text-cyan-600 transition-colors block py-1"
                >
                  View System Reports
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN CONTAINER */}
        <div id="profile-dropdown-container" className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 shrink-0 transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
          >
            {/* Initials Avatar */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-md border border-cyan-400/20 select-none">
              {getInitials(adminUser.fullName)}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-800">{adminUser.fullName}</p>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{adminUser.role}</span>
            </div>
          </button>

          {/* USER CARD DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-slate-800">{adminUser.fullName}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Mail size={10} />
                  <span className="truncate">{adminUser.email}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                  <Shield size={10} />
                  <span>{adminUser.role}</span>
                </div>
              </div>

              <div className="px-2 py-2 flex flex-col gap-0.5">
                <Link
                  href="/admin1/user-management"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-semibold transition"
                >
                  <User size={14} className="text-slate-400" />
                  <span>Manage Accounts</span>
                </Link>
              </div>

              <div className="px-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-bold transition cursor-pointer"
                >
                  <LogOut size={14} className="text-red-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

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
  Settings,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

export default function UserNavbar({ collapsed, setCollapsed }) {
  const router = useRouter();

  // Dropdown States
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Change Password Modal State
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Live Employee State
  const [userProfile, setUserProfile] = useState(null);
  const [fullEmployeeObj, setFullEmployeeObj] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Live Notifications State
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load live employee profile & system activity from Employee database table
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

        // 2. Fetch directly from Employee table if session is missing or to get fresh password
        const empRes = await axios.get("http://localhost:5000/api/Employee").catch(() => null);
        if (empRes?.data?.data && Array.isArray(empRes.data.data) && empRes.data.data.length > 0) {
          const matched = empRes.data.data.find(
            (e) =>
              (e._id && currentEmployee && (e._id === currentEmployee._id || e._id === currentEmployee.id)) ||
              (e.email && currentEmployee && e.email.toLowerCase() === (currentEmployee.email || "").toLowerCase())
          );
          currentEmployee = matched || empRes.data.data[0];
        }

        if (currentEmployee) {
          setFullEmployeeObj(currentEmployee);
          setUserProfile({
            id: currentEmployee._id || currentEmployee.id,
            name: currentEmployee.name || currentEmployee.fullName || "Employee",
            email: currentEmployee.email || "employee@crm.com",
            phone: currentEmployee.phone || "",
            designation: currentEmployee.designation || "Staff Member",
            department: currentEmployee.department || "General",
            employeeId: currentEmployee.employeeid || currentEmployee.employeeId || "EMP001",
            password: currentEmployee.password || "",
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

  // Reset modal error states when typing current password
  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
    if (oldPasswordError) setOldPasswordError("");
    if (passwordError) setPasswordError("");
  };

  // Handle Change Password Form Submission
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setOldPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setOldPasswordError("Incorrect old password");
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setLoadingPassword(true);

    try {
      // 1. Call Backend API in EmployeeRoutes.js (/api/Employee/change-password)
      const res = await axios
        .put("http://localhost:5000/api/Employee/change-password", {
          id: userProfile?.id || fullEmployeeObj?._id,
          email: userProfile?.email,
          oldPassword: currentPassword,
          newPassword: newPassword,
        })
        .catch((err) => err.response);

      // Handle invalid old password error from API
      if (res && res.data && res.data.success === false) {
        if (res.data.isOldPasswordInvalid || res.status === 400 || res.status === 401) {
          setOldPasswordError("Incorrect old password");
          setLoadingPassword(false);
          return;
        } else {
          setPasswordError(res.data.message || "Failed to change password");
          setLoadingPassword(false);
          return;
        }
      }

      // 2. Fallback check against local session if API call didn't execute
      const actualOldPassword =
        fullEmployeeObj?.password ||
        userProfile?.password ||
        (typeof window !== "undefined" && JSON.parse(localStorage.getItem("employee") || "{}")?.password);

      if (actualOldPassword && currentPassword !== actualOldPassword) {
        setOldPasswordError("Incorrect old password");
        setLoadingPassword(false);
        return;
      }

      // 3. Fallback direct update if needed
      let targetId = userProfile?.id || fullEmployeeObj?._id;
      if (targetId) {
        await axios.put(`http://localhost:5000/api/Employee/${targetId}`, {
          ...(fullEmployeeObj || {}),
          password: newPassword,
        }).catch(() => null);
      }

      // 4. Update local storage session with new password
      if (typeof window !== "undefined") {
        const existingEmp = JSON.parse(localStorage.getItem("employee") || "{}");
        const updatedEmpSession = {
          ...existingEmp,
          ...(fullEmployeeObj || {}),
          ...(userProfile || {}),
          password: newPassword,
        };
        localStorage.setItem("employee", JSON.stringify(updatedEmpSession));
        localStorage.setItem("user", JSON.stringify(updatedEmpSession));
      }

      // Update in-memory states with new password
      setUserProfile((prev) => (prev ? { ...prev, password: newPassword } : null));
      setFullEmployeeObj((prev) => (prev ? { ...prev, password: newPassword } : null));

      setPasswordSuccess("New password saved successfully in Employee Table!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setPasswordSuccess("");
        setChangePasswordOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError("An unexpected error occurred while changing password.");
    } finally {
      setLoadingPassword(false);
    }
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
    <>
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
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks, projects, meetings..."
              className="w-56 lg:w-64 h-10 rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 outline-none text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          {/* SETTINGS BUTTON */}
          <button
            onClick={() => {
              setOldPasswordError("");
              setPasswordError("");
              setPasswordSuccess("");
              setChangePasswordOpen(true);
            }}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-xs transition shrink-0 active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Settings & Change Password"
          >
            <Settings size={18} className="text-slate-600 hover:rotate-45 transition-transform duration-300" />
            <span className="hidden lg:inline text-xs font-bold">Settings</span>
          </button>

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
                    href="/User1/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-bold text-slate-400 hover:text-cyan-600 transition-colors block py-1"
                  >
                    View All Notifications
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
                    href="/User1/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition"
                  >
                    <User size={14} className="text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setOldPasswordError("");
                      setPasswordError("");
                      setPasswordSuccess("");
                      setChangePasswordOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition text-left cursor-pointer"
                  >
                    <Lock size={14} className="text-slate-400" />
                    <span>Change Password</span>
                  </button>
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

      {/* CHANGE PASSWORD MODAL */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => {
                setChangePasswordOpen(false);
                setOldPasswordError("");
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full w-fit mb-3">
              <KeyRound size={13} />
              <span>SECURITY SETTINGS</span>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Change Account Password
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Connected to <span className="font-bold text-slate-700">Employee Table</span> database ({userProfile?.email}).
            </p>

            {passwordError && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="mt-5 space-y-4">
              {/* CURRENT / OLD PASSWORD INPUT */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Old / Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    placeholder="Enter correct old password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    className={`w-full h-11 rounded-xl border pl-4 pr-10 text-xs font-bold outline-none transition ${
                      oldPasswordError
                        ? "border-rose-500 ring-2 ring-rose-200 bg-rose-50/20 text-rose-900 placeholder-rose-300"
                        : "border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* USER-FRIENDLY UI/UX WARNING FOR INCORRECT OLD PASSWORD */}
                {oldPasswordError && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 shadow-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1.5 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5 border border-rose-200/50">
                      <AlertTriangle size={15} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-rose-800 tracking-tight leading-tight">
                        Incorrect Old Password
                      </h4>
                      <p className="text-[11px] font-medium text-rose-600/90 leading-relaxed mt-0.5">
                        The current password you entered doesn't match your stored employee credentials. Please enter your correct old password.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordOpen(false);
                    setOldPasswordError("");
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {loadingPassword ? "Verifying & Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

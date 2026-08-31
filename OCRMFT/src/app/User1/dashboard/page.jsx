"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Video,
  MapPin,
  ClipboardList,
  FolderKanban,
  ArrowUpRight,
  User,
  Sparkles,
} from "lucide-react";
import { isMeetingExpired } from "@/app/admin1/meeting/utils";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [myMeetings, setMyMeetings] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        let emp = null;

        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("employee") || localStorage.getItem("user");
          if (stored) {
            try {
              emp = JSON.parse(stored);
            } catch (e) {
              console.error("Session parse error:", e);
            }
          }
        }

        if (!emp || !emp.name) {
          const empRes = await axios.get("http://localhost:5000/api/Employee");
          if (empRes.data?.data?.length > 0) {
            emp = empRes.data.data[0];
          }
        }

        const profile = {
          name: emp?.name || emp?.fullName || "Kamal Kumar",
          email: emp?.email || "kamal@odizocrm.com",
          employeeId: emp?.employeeid || emp?.employeeId || "EMP001",
          designation: emp?.designation || "Software Engineer",
          department: emp?.department || "Engineering",
        };
        setEmployeeProfile(profile);

        const empNameLower = profile.name.toLowerCase();
        const empEmailLower = profile.email.toLowerCase();

        // Parallel data fetch
        const [meetingRes, taskRes, projectRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/Meeting"),
          axios.get("http://localhost:5000/api/Task"),
          axios.get("http://localhost:5000/api/Project"),
        ]);

        // Filter meetings for this employee
        if (meetingRes.status === "fulfilled" && Array.isArray(meetingRes.value.data?.data)) {
          const filtered = meetingRes.value.data.data.filter((mtg) => {
            if (!mtg.participants || !Array.isArray(mtg.participants) || mtg.participants.length === 0) {
              return true;
            }
            return mtg.participants.some((p) => {
              const pName = (p.name || "").toLowerCase();
              const pEmail = (p.email || "").toLowerCase();
              return (
                (empNameLower && pName.includes(empNameLower)) ||
                (empEmailLower && pEmail.includes(empEmailLower)) ||
                (pName && empNameLower.includes(pName))
              );
            });
          });
          setMyMeetings(filtered);
        }

        // Filter tasks for this employee
        if (taskRes.status === "fulfilled" && Array.isArray(taskRes.value.data?.data)) {
          const tasks = taskRes.value.data.data;
          setMyTasks(tasks);
        }

        // Filter projects
        if (projectRes.status === "fulfilled" && Array.isArray(projectRes.value.data?.data)) {
          const projs = projectRes.value.data.data;
          setMyProjects(projs);
        }

      } catch (err) {
        console.error("Employee dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatDate = (dStr) => {
    if (!dStr) return "-";
    return new Date(dStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Assembling employee portal...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* WELCOME BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-3">
              <Sparkles size={12} className="animate-spin" />
              <span>EMPLOYEE WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {employeeProfile?.name}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              {employeeProfile?.designation} • {employeeProfile?.department} ({employeeProfile?.employeeId})
            </p>
          </div>

          <Link
            href="/User1/meetings"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition active:scale-95 self-start md:self-auto"
          >
            <CalendarDays size={16} />
            <span>My Meetings ({myMeetings.length})</span>
          </Link>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Meetings</span>
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 border border-cyan-100">
              <CalendarDays size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3">{myMeetings.length}</h3>
          <p className="text-[11px] font-semibold text-cyan-600 mt-1">Calendar Invites</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Tasks</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 border border-indigo-100">
              <ClipboardList size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3">{myTasks.length}</h3>
          <p className="text-[11px] font-semibold text-indigo-600 mt-1">Assigned Work Items</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Projects</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
              <FolderKanban size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-3">{myProjects.length}</h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Active Engagements</p>
        </div>
      </div>

      {/* MEETINGS & TASKS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* MY MEETINGS PANEL */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <CalendarDays size={18} />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">My Meeting Schedule</h2>
              </div>
              <Link
                href="/User1/meetings"
                className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline"
              >
                <span>View All</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {myMeetings.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-semibold">
                No meetings assigned yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {myMeetings.slice(0, 4).map((mtg) => {
                  const expired = isMeetingExpired(mtg.meetingDate, mtg.endTime);

                  return (
                    <div
                      key={mtg._id || mtg.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
                    >
                      <div className="min-w-0 leading-tight">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                              expired
                                ? "bg-amber-100 text-amber-800"
                                : mtg.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-cyan-100 text-cyan-800"
                            }`}
                          >
                            {expired ? "Expired" : mtg.status}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {formatDate(mtg.meetingDate)}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{mtg.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" />
                          <span>
                            {mtg.startTime} - {mtg.endTime} ({mtg.meetingType})
                          </span>
                        </p>
                      </div>

                      {mtg.meetingLink && (
                        expired ? (
                          <span className="ml-3 shrink-0 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-400 select-none">
                            Link Expired
                          </span>
                        ) : (
                          <a
                            href={mtg.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-3 shrink-0 rounded-lg bg-cyan-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-cyan-700 transition"
                          >
                            Join
                          </a>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MY ASSIGNED TASKS PANEL */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <ClipboardList size={18} />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">Assigned Tasks</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">{myTasks.length} Items</span>
            </div>

            {myTasks.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-semibold">
                No active tasks assigned.
              </div>
            ) : (
              <div className="space-y-3.5">
                {myTasks.slice(0, 4).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <div className="min-w-0 leading-tight">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                          {task.status || "Pending"}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Priority: {task.priority || "Normal"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {task.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  ClipboardList,
  Calendar,
  User,
  Flag,
  FileText,
  Clock,
  Settings,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Building2,
  Tag,
  Sparkles,
} from "lucide-react";

import StatusBadge from "../../taskcomponents/StatusBadge";
import PriorityBadge from "../../taskcomponents/PriorityBadge";
import { getTaskById } from "../../data";

export default function ViewTaskPage() {
  const params = useParams();
  const id = params?.id;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    async function loadUsersMap() {
      try {
        const [uRes, eRes] = await Promise.allSettled([
          fetch("http://localhost:5000/api/User").then((r) => r.json()),
          fetch("http://localhost:5000/api/Employee").then((r) => r.json()),
        ]);

        const map = {};
        if (uRes.status === "fulfilled" && Array.isArray(uRes.value?.data)) {
          uRes.value.data.forEach((u) => {
            if (u._id || u.id) map[u._id || u.id] = u;
          });
        }

        if (eRes.status === "fulfilled" && Array.isArray(eRes.value?.data)) {
          eRes.value.data.forEach((e) => {
            const key = e._id || e.id;
            if (key) {
              map[key] = {
                ...e,
                fullName: e.name || e.fullName || "Employee",
              };
            }
          });
        }
        setUsersMap(map);
      } catch (err) {
        console.error("Error loading users map for view task:", err);
      }
    }
    loadUsersMap();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTaskById(id);
        setTask(data?.data || data);
      } catch (error) {
        console.error("Fetch task error:", error);
        setError(
          error.message || "Something went wrong while loading the task details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const resolveMemberName = (val, storedName = "") => {
    if (storedName && typeof storedName === "string" && storedName.trim()) {
      return storedName.trim();
    }
    if (!val) return "-";
    if (typeof val === "object" && val !== null) {
      return val.fullName || val.name || val.email || "-";
    }
    if (typeof val === "string" && val.trim()) {
      const cleanVal = val.trim();
      if (usersMap[cleanVal]) {
        const match = usersMap[cleanVal];
        return match.fullName || match.name || match.email || cleanVal;
      }
      return cleanVal;
    }
    return "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }
    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Task Details...</h2>
          <p className="text-sm text-slate-400 mt-1">Retrieving deliverable specifications.</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <ClipboardList size={26} />
          </div>
          <h2 className="text-2xl font-black text-rose-600">Task Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">
            {error || "The requested task deliverable could not be found."}
          </p>

          <Link
            href="/admin1/task-assignment"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = task.title || "Untitled Task";
  const assignedToName = resolveMemberName(task.assignedTo, task.assignedToName);
  const assignedByName = resolveMemberName(task.assignedBy, task.assignedByName);
  const progressPct =
    task.progress !== undefined
      ? task.progress
      : task.status === "Completed"
      ? 100
      : task.status === "In Progress"
      ? 50
      : 0;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-extrabold text-blue-600 border border-blue-100 mb-2">
            <Sparkles size={12} />
            <span>TASK DELIVERABLE #{task.taskNumber || task.id || "001"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
          <p className="mt-1 text-slate-500 text-xs sm:text-sm font-medium">
            Full specification, project linkage, team assignees, and progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin1/task-assignment"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 text-xs shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to List</span>
          </Link>

          <Link
            href={`/admin1/task-assignment/edit/${task.id || task._id}`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition duration-300 active:scale-95 cursor-pointer"
          >
            <Pencil size={16} />
            <span>Edit Task</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden h-fit">
          <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>

          <div className="px-6 pb-6 relative flex flex-col items-center -mt-14 text-center border-b border-slate-100">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-md overflow-hidden shrink-0">
              <ClipboardList size={32} />
            </div>

            <h2 className="mt-3 text-lg font-black text-slate-800 tracking-tight leading-snug px-2">
              {title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* ASSIGNED TO */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0 border border-blue-200">
                {assignedToName !== "-" ? assignedToName[0].toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Assigned To (Member)
                </span>
                <span className="font-bold text-slate-800 text-sm truncate block mt-0.5">
                  {assignedToName}
                </span>
              </div>
            </div>

            {/* ASSIGNED BY */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-sm shrink-0 border border-cyan-200">
                {assignedByName !== "-" ? assignedByName[0].toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Assigned By (Manager / Admin)
                </span>
                <span className="font-bold text-slate-800 text-sm truncate block mt-0.5">
                  {assignedByName}
                </span>
              </div>
            </div>

            {/* ASSOCIATED PROJECT */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-200">
                <FolderKanban size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Associated Project
                </span>
                <span className="font-bold text-slate-800 text-sm truncate block mt-0.5">
                  {task.projectName || task.project || "General Deliverable"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Spec Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar Banner */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-blue-600" /> Task Completion Progress
              </span>
              <span className="text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                {progressPct}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Start Date",
                val: formatDate(task.startDate),
                icon: Calendar,
                color: "text-blue-600 bg-blue-50 border-blue-100",
              },
              {
                label: "Due Date",
                val: formatDate(task.dueDate),
                icon: Calendar,
                color: "text-rose-600 bg-rose-50 border-rose-100",
              },
              {
                label: "Created Date",
                val: formatDate(task.createdAt),
                icon: Clock,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              },
              {
                label: "Completed Date",
                val: task.completedAt ? formatDate(task.completedAt) : "Pending",
                icon: CheckCircle2,
                color: "text-purple-600 bg-purple-50 border-purple-100",
              },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm flex items-center gap-3"
                >
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${metric.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {metric.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                      {metric.val}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Description Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Task Description & Instructions</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-xs text-slate-700 leading-relaxed font-medium">
              {task.description || "No description provided for this task."}
            </div>
          </div>

          {/* Notes Card if present */}
          {task.notes && (
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className="text-base font-bold text-slate-800">Additional Notes & Remarks</h3>
              </div>
              <div className="rounded-xl border border-amber-200/50 bg-amber-50/30 p-4 text-xs font-medium text-amber-900">
                {task.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

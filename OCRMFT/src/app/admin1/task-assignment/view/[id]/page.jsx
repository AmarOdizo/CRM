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
  Settings
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
          error.message || "Something went wrong while loading the task.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Task...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve task details.</p>
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

  const name = task.title || "Untitled Task";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Task Details</h1>
          <p className="mt-1 text-slate-500 font-medium">Complete details, deadlines, and assignment specs.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin1/task-assignment"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to List</span>
          </Link>

          <Link
            href={`/admin1/task-assignment/edit/${task.id}`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
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
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>
          
          <div className="px-6 pb-6 relative flex flex-col items-center -mt-16 text-center border-b border-slate-100">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-md overflow-hidden shrink-0">
              <ClipboardList size={36} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-800 tracking-tight line-clamp-2 px-2">{name}</h2>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned To</span>
                <span className="font-semibold text-slate-700 mt-0.5">
                  {task.assignedTo?.fullName || task.assignedTo || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned By</span>
                <span className="font-semibold text-slate-700 mt-0.5">
                  {task.assignedBy?.fullName || task.assignedBy || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Start Date", val: formatDate(task.startDate), icon: Calendar, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { label: "Due Date", val: formatDate(task.dueDate), icon: Calendar, color: "text-rose-600 bg-rose-50 border-rose-100" },
              { label: "Created Date", val: formatDate(task.createdAt), icon: Clock, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Task ID", val: `#${task.id}`, icon: Settings, color: "text-purple-600 bg-purple-50 border-purple-100" },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border shrink-0 ${metric.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5 truncate">{metric.val}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Description Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Task Description</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {task.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

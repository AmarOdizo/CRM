"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckSquare,
  Search,
  Filter,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit,
  Sparkles,
  User,
  Calendar,
  X,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default function TaskProgressPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Update Task Modal State
  const [editingTask, setEditingTask] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/Task");
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setTasks(list);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks database.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (task) => {
    setEditingTask(task);
    setUpdateStatus(task.status || "In Progress");
    setUpdateProgress(task.progress !== undefined ? task.progress : task.status === "Completed" ? 100 : 50);
  };

  const handleSaveTaskProgress = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      setUpdating(true);
      const taskId = editingTask._id || editingTask.id;
      const payload = {
        ...editingTask,
        status: updateStatus,
        progress: Number(updateProgress),
      };

      await axios.put(`http://localhost:5000/api/Task/${taskId}`, payload);

      setSuccessMsg(`Task "${editingTask.title || 'Task'}" status updated to ${updateStatus}!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
      // Fallback local update if API fails
      setTasks((prev) =>
        prev.map((t) =>
          (t._id || t.id) === (editingTask._id || editingTask.id)
            ? { ...t, status: updateStatus, progress: Number(updateProgress) }
            : t
        )
      );
      setEditingTask(null);
      setSuccessMsg("Task progress updated locally!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } finally {
      setUpdating(false);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (t.title || "").toLowerCase().includes(searchLower) ||
      (t.projectName || t.project || "").toLowerCase().includes(searchLower) ||
      (t.description || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" ||
      (t.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "ALL" ||
      (t.priority || "").toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalTasks = tasks.length;
  const pendingCount = tasks.filter((t) => (t.status || "").toLowerCase() === "pending").length;
  const inProgressCount = tasks.filter((t) => (t.status || "").toLowerCase() === "in progress").length;
  const completedCount = tasks.filter((t) => (t.status || "").toLowerCase() === "completed").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const st = (status || "Pending").toLowerCase();
    if (st === "completed") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (st === "in progress") return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (st === "overdue" || st === "urgent") return "bg-rose-100 text-rose-800 border-rose-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  const getPriorityBadge = (priority) => {
    const pr = (priority || "Medium").toLowerCase();
    if (pr === "high" || pr === "urgent") return "bg-rose-50 text-rose-700 border-rose-200";
    if (pr === "medium") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-bold text-indigo-300 mb-3">
              <CheckSquare size={13} />
              <span>TASK MANAGEMENT</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Update Task Progress
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Track assigned work items, update completion status, and keep team leads informed of current progress.
            </p>
          </div>

          <button
            onClick={fetchTasks}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Sync Tasks</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Assigned
            </span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 border border-indigo-100">
              <ClipboardList size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{totalTasks}</h3>
          <p className="text-[11px] font-semibold text-indigo-600 mt-1">All Work Items</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending
            </span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{pendingCount}</h3>
          <p className="text-[11px] font-semibold text-amber-600 mt-1">Awaiting Execution</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In Progress
            </span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{inProgressCount}</h3>
          <p className="text-[11px] font-semibold text-blue-600 mt-1">Currently Active</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{completedCount}</h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Done & Verified</p>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search task title, project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* TASKS TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 mx-auto" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading task items...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ClipboardList size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No Tasks Found</p>
            <p className="text-xs text-slate-400 mt-1">No assigned tasks match your query filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Task Details</th>
                  <th className="py-4 px-5">Project</th>
                  <th className="py-4 px-5">Priority</th>
                  <th className="py-4 px-5">Due Date</th>
                  <th className="py-4 px-5">Progress</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTasks.map((t) => {
                  const prog = t.progress !== undefined ? t.progress : t.status === "Completed" ? 100 : t.status === "In Progress" ? 50 : 10;

                  return (
                    <tr key={t._id || t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800 text-sm">{t.title || "Task Title"}</div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-xs">
                          {t.description || "No specific instructions provided."}
                        </p>
                      </td>

                      <td className="py-4 px-5 font-semibold text-slate-700">
                        {t.projectName || t.project || "General Operations"}
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(t.priority)}`}>
                          {t.priority || "Normal"}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-medium text-slate-600">
                        {formatDate(t.dueDate || t.deadline)}
                      </td>

                      <td className="py-4 px-5">
                        <div className="w-28">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>{prog}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(t.status)}`}>
                          {t.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleOpenUpdateModal(t)}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 font-bold text-xs transition cursor-pointer border border-indigo-100"
                        >
                          <Edit size={13} />
                          <span>Update Progress</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setEditingTask(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full w-fit mb-3">
              <CheckSquare size={13} />
              <span>UPDATE STATUS</span>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {editingTask.title}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Project: <span className="font-bold text-slate-700">{editingTask.projectName || editingTask.project || "General"}</span>
            </p>

            <form onSubmit={handleSaveTaskProgress} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-2">
                  Completion Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => {
                    const newSt = e.target.value;
                    setUpdateStatus(newSt);
                    if (newSt === "Completed") setUpdateProgress(100);
                    else if (newSt === "Pending") setUpdateProgress(0);
                  }}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold uppercase text-slate-500">
                    Progress Percentage
                  </label>
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {updateProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={updateProgress}
                  onChange={(e) => setUpdateProgress(e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Progress Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

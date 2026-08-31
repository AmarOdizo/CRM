"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  User,
  MessageSquare,
  AlertTriangle,
  Eye,
  Building2,
} from "lucide-react";

export default function DailyUpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("ALL");

  // Log Form Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [hoursSpent, setHoursSpent] = useState("8");
  const [workSummary, setWorkSummary] = useState("");
  const [blockers, setBlockers] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Selected update detail view modal
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectRes = await axios.get("http://localhost:5000/api/Project").catch(() => null);
      const projectList = Array.isArray(projectRes?.data?.data) ? projectRes.data.data : [];
      setProjects(projectList);

      // Seed realistic daily updates combined with stored entries
      const seedUpdates = [
        {
          id: "log-201",
          date: "2026-08-31",
          employeeName: "Kamal Kumar",
          projectName: projectList[0]?.projectName || "Odizo CRM Upgrade",
          hours: "7.5",
          taskStatus: "Completed",
          summary: "Implemented responsive employee workspace navigation and integrated live user session storage.",
          blockers: "None",
        },
        {
          id: "log-202",
          date: "2026-08-30",
          employeeName: "Kamal Kumar",
          projectName: projectList[1]?.projectName || "E-Commerce Gateway",
          hours: "8.0",
          taskStatus: "In Progress",
          summary: "Configured API payload transformers and error handling mechanisms for task assignment table.",
          blockers: "Awaiting backend response schema clarification.",
        },
        {
          id: "log-203",
          date: "2026-08-29",
          employeeName: "Kamal Kumar",
          projectName: projectList[0]?.projectName || "Odizo CRM Upgrade",
          hours: "6.0",
          taskStatus: "In Progress",
          summary: "Reviewed role permissions and structured modular UI tables.",
          blockers: "None",
        },
      ];

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_daily_updates");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUpdates([...parsed, ...seedUpdates]);
          } catch (e) {
            setUpdates(seedUpdates);
          }
        } else {
          setUpdates(seedUpdates);
        }
      } else {
        setUpdates(seedUpdates);
      }
    } catch (err) {
      console.error("Error loading daily updates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUpdate = (e) => {
    e.preventDefault();
    if (!selectedProject || !workSummary) return;

    setSubmitting(true);

    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      employeeName: "Kamal Kumar",
      projectName: selectedProject,
      hours: hoursSpent || "8",
      taskStatus: taskStatus,
      summary: workSummary,
      blockers: blockers || "None",
    };

    const updated = [newLog, ...updates];
    setUpdates(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_daily_updates", JSON.stringify([newLog]));
    }

    setSubmitting(false);
    setModalOpen(false);
    setSuccessMsg("Daily work update logged successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset Form
    setSelectedProject("");
    setWorkSummary("");
    setBlockers("");
    setHoursSpent("8");
  };

  const filteredUpdates = updates.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (u.summary || "").toLowerCase().includes(searchLower) ||
      (u.projectName || "").toLowerCase().includes(searchLower) ||
      (u.employeeName || "").toLowerCase().includes(searchLower);

    const matchesProject =
      projectFilter === "ALL" ||
      (u.projectName || "").toLowerCase() === projectFilter.toLowerCase();

    return matchesSearch && matchesProject;
  });

  const totalHours = updates.reduce((sum, u) => sum + (parseFloat(u.hours) || 0), 0);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300 mb-3">
              <ClipboardList size={13} />
              <span>EMPLOYEE WORKLOG</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Daily Work Updates
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Record daily accomplishments, hours worked, and communicate project blockers with team leaders.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Log Today's Work</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Hours Logged
            </span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{totalHours.toFixed(1)} hrs</h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Recorded Productivity</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Update Submissions
            </span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
              <ClipboardList size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{updates.length}</h3>
          <p className="text-[11px] font-semibold text-blue-600 mt-1">Daily Entries</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Status Review
            </span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 border border-indigo-100">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">100%</h3>
          <p className="text-[11px] font-semibold text-indigo-600 mt-1">Verified Log entries</p>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
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
            placeholder="Search work summary or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Filter Project:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p._id || p.id} value={p.projectName}>
                {p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* UPDATES TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 mx-auto" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading daily updates...</p>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ClipboardList size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No Daily Updates Found</p>
            <p className="text-xs text-slate-400 mt-1">Log your first daily work update using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Log Date</th>
                  <th className="py-4 px-5">Project Name</th>
                  <th className="py-4 px-5">Hours</th>
                  <th className="py-4 px-5">Work Summary</th>
                  <th className="py-4 px-5">Task Status</th>
                  <th className="py-4 px-5 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUpdates.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-800 whitespace-nowrap">
                      {u.date}
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-700 whitespace-nowrap">
                      {u.projectName}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {u.hours} hrs
                      </span>
                    </td>

                    <td className="py-4 px-5 max-w-sm">
                      <p className="text-slate-600 line-clamp-1 font-medium">{u.summary}</p>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          u.taskStatus === "Completed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}
                      >
                        {u.taskStatus || "In Progress"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(u)}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-1.5 font-bold text-xs transition cursor-pointer border border-slate-200"
                      >
                        <Eye size={13} />
                        <span>View Log</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOG WORK MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit mb-3">
              <ClipboardList size={13} />
              <span>DAILY WORK ENTRY</span>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Log Daily Accomplishments
            </h2>

            <form onSubmit={handleCreateUpdate} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Target Project
                </label>
                <select
                  required
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer"
                >
                  <option value="">Select project...</option>
                  {projects.length > 0 ? (
                    projects.map((p) => (
                      <option key={p._id || p.id} value={p.projectName}>
                        {p.projectName}
                      </option>
                    ))
                  ) : (
                    <option value="Odizo CRM Upgrade">Odizo CRM Upgrade</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                    Hours Spent
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    required
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                    Work Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Work Summary / Deliverables
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail modules worked on, commits, bug fixes..."
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1">
                  Challenges / Blockers (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Awaiting backend deployment..."
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Log Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-slate-800 tracking-tight">Work Log Details</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Date: {selectedLog.date}</p>

            <div className="mt-5 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-400 uppercase text-[10px]">Project</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedLog.projectName}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-400 uppercase text-[10px]">Hours Logged</span>
                <p className="font-extrabold text-emerald-700 text-sm mt-0.5">{selectedLog.hours} Hours</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-400 uppercase text-[10px]">Accomplishments</span>
                <p className="font-medium text-slate-700 leading-relaxed mt-1">{selectedLog.summary}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-extrabold text-slate-400 uppercase text-[10px]">Blockers</span>
                <p className="font-medium text-slate-600 mt-1">{selectedLog.blockers}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

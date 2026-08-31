"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderKanban,
  Search,
  Filter,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Eye,
  Sparkles,
  Building2,
  Tag,
  X,
  Layers,
} from "lucide-react";

export default function AssignedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/Project");
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setProjects(list);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch assigned projects from server.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Projects
  const filteredProjects = projects.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (p.projectName || p.title || "").toLowerCase().includes(searchLower) ||
      (p.projectCode || p.code || "").toLowerCase().includes(searchLower) ||
      (p.clientName || p.client || "").toLowerCase().includes(searchLower) ||
      (p.category || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" ||
      (p.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "ALL" ||
      (p.priority || "").toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate Metrics
  const totalProjects = projects.length;
  const inProgressCount = projects.filter(
    (p) => (p.status || "").toLowerCase() === "in progress"
  ).length;
  const completedCount = projects.filter(
    (p) => (p.status || "").toLowerCase() === "completed"
  ).length;
  const onHoldCount = projects.filter(
    (p) => (p.status || "").toLowerCase() === "on hold" || (p.status || "").toLowerCase() === "pending"
  ).length;

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
    if (st === "completed") {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (st === "in progress") {
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    }
    if (st === "on hold") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getPriorityBadge = (priority) => {
    const pr = (priority || "Medium").toLowerCase();
    if (pr === "high" || pr === "urgent") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (pr === "medium") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* HEADER BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-3">
              <FolderKanban size={13} />
              <span>PROJECT REPOSITORY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Assigned Projects
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Track project milestones, deliverables, timelines, and team engagements in real-time.
            </p>
          </div>

          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Refresh Projects Data</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Projects
            </span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100">
              <Briefcase size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{totalProjects}</h3>
          <p className="text-[11px] font-semibold text-blue-600 mt-1">All Assigned Engagements</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In Progress
            </span>
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 border border-cyan-100">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{inProgressCount}</h3>
          <p className="text-[11px] font-semibold text-cyan-600 mt-1">Active Deliverables</p>
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
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Successfully Delivered</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              On Hold / Pending
            </span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mt-3">{onHoldCount}</h3>
          <p className="text-[11px] font-semibold text-amber-600 mt-1">Requires Attention</p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name, code, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600 mx-auto" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Fetching projects database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Briefcase size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">No Projects Found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search or filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-5">Project Details</th>
                  <th className="py-4 px-5">Client</th>
                  <th className="py-4 px-5">Timeline</th>
                  <th className="py-4 px-5">Priority</th>
                  <th className="py-4 px-5">Progress</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((p) => {
                  const progressPct = p.progress !== undefined ? p.progress : p.status === "Completed" ? 100 : p.status === "In Progress" ? 65 : 20;

                  return (
                    <tr key={p._id || p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800 text-sm">{p.projectName || p.title || "Untitled Project"}</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                            {p.projectCode || p.code || "PRJ-001"}
                          </span>
                          <span>•</span>
                          <span>{p.category || p.technology || "General"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Building2 size={13} className="text-slate-400" />
                          <span>{p.clientName || p.client || "Internal Odizo"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-slate-600 font-medium">
                          <div>Start: {formatDate(p.startDate || p.createdAt)}</div>
                          <div className="text-slate-400 text-[11px]">Due: {formatDate(p.endDate || p.deadline)}</div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(p.priority)}`}>
                          {p.priority || "Medium"}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cyan-600 transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(p.status)}`}>
                          {p.status || "Pending"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 px-3 py-1.5 font-bold text-xs transition cursor-pointer border border-slate-200 hover:border-cyan-200"
                        >
                          <Eye size={13} />
                          <span>Details</span>
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

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full w-fit mb-3">
              <Layers size={13} />
              <span>PROJECT OVERVIEW</span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {selectedProject.projectName || selectedProject.title || "Project Details"}
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Code: <span className="font-mono text-slate-700 font-bold">{selectedProject.projectCode || selectedProject.code || "N/A"}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Client</span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Building2 size={14} className="text-cyan-600" />
                  <span>{selectedProject.clientName || selectedProject.client || "Odizo Enterprise"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Category / Tech</span>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Tag size={14} className="text-cyan-600" />
                  <span>{selectedProject.category || selectedProject.technology || "Software Development"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Timeline</span>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate || selectedProject.deadline)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Status & Priority</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(selectedProject.status)}`}>
                    {selectedProject.status || "Pending"}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(selectedProject.priority)}`}>
                    {selectedProject.priority || "Medium"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Description & Scope</span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                {selectedProject.description || selectedProject.details || "No extended description recorded for this project."}
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

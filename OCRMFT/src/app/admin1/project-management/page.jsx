"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, CheckCircle2, AlertCircle, Plus } from "lucide-react";

import { getProjects, deleteProject } from "./data";

import ProjectTable from "./projectcomponents/ProjectTable";
import SearchFilter from "./projectcomponents/SearchFilter";
import ExportCSV from "./projectcomponents/ExportCSV";
import ProjectFormModal from "./projectcomponents/ProjectFormModal";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      project.projectName?.toLowerCase().includes(keyword) ||
      project.projectCode?.toLowerCase().includes(keyword) ||
      project.clientName?.toLowerCase().includes(keyword);

    const matchesStatus = status === "All" || project.status === status;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const onHold = projects.filter((p) => p.status === "On Hold").length;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Management</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Manage your company projects, milestones, deadlines, and progress.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportCSV projects={filteredProjects} />
          <button
            onClick={() => {
              setSelectedProjectId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Projects",
            val: totalProjects,
            icon: Briefcase,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "In Progress",
            val: inProgress,
            icon: TrendingUp,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
          {
            title: "Completed",
            val: completed,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "On Hold",
            val: onHold,
            icon: AlertCircle,
            color: "text-rose-600 bg-rose-50/50 border-rose-200/50",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">
                  {loading ? "..." : card.val}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Export */}
      <div className="mb-6">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500 font-semibold shadow-sm animate-pulse">
          Loading Projects...
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onDelete={handleDelete}
          onEdit={(project) => {
            setSelectedProjectId(project.id);
            setModalOpen(true);
          }}
        />
      )}

      <ProjectFormModal
        open={modalOpen}
        projectId={selectedProjectId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchProjects();
        }}
      />
    </div>
  );
}

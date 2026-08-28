"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Layers,
  DollarSign,
  User,
  Briefcase,
  Code2,
  Users,
  FileText,
  Clock
} from "lucide-react";

import { getProjectById } from "../../data";
import StatusBadge from "../../projectcomponents/StatusBadge";

const priorityColors = {
  Low: "bg-emerald-50 border-emerald-100 text-emerald-700",
  Medium: "bg-amber-50 border-amber-100 text-amber-700",
  High: "bg-orange-50 border-orange-100 text-orange-700",
  Critical: "bg-rose-50 border-rose-100 text-rose-700",
};

export default function ViewProject() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (error) {
      console.log(error);
      alert("Project Not Found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Project...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve project specs.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center max-w-sm">
          <h2 className="text-2xl font-black text-rose-600">Project Not Found</h2>
          <p className="text-slate-400 text-sm mt-2 mb-6">The registered project record does not exist or may have been deleted.</p>
          <Link
            href="/admin1/project-management"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Management</span>
          </Link>
        </div>
      </div>
    );
  }

  const name = project.projectName || "Unassigned Project";
  const code = project.projectCode || "PRJ-XXX";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Details</h1>
          <p className="mt-1 text-slate-500 font-medium">Detailed specs, timeline schedule, and team logs.</p>
        </div>

        <Link
          href="/admin1/project-management"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Summary Card */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden h-fit">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative"></div>
          
          <div className="px-6 pb-6 relative flex flex-col items-center -mt-16 text-center border-b border-slate-100">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-3xl shadow-md overflow-hidden shrink-0">
              <Briefcase size={36} />
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-800 tracking-tight">{name}</h2>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 rounded-md px-2.5 py-1 mt-1.5 border border-slate-200/50">
              {code}
            </span>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <StatusBadge status={project.status} />
              <span
                className={`rounded-lg border px-3 py-1 text-xs font-bold ${
                  priorityColors[project.priority] || "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {project.priority} Priority
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Client</span>
                <span className="font-semibold text-slate-700 mt-0.5">{project.clientName || "-"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Manager</span>
                <span className="font-semibold text-slate-700 mt-0.5">{project.projectManager || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Budget", val: project.budget || "-", icon: DollarSign, color: "text-blue-600 bg-blue-50 border-blue-100" },
              { label: "Start Date", val: project.startDate || "-", icon: Calendar, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "Deadline", val: project.endDate || "-", icon: Clock, color: "text-rose-600 bg-rose-50 border-rose-100" },
              {
                label: "Registered At",
                val: project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : "-",
                icon: Clock,
                color: "text-purple-600 bg-purple-50 border-purple-100"
              },
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

          {/* Technology Stack */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Code2 size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Technology Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologyStack?.length ? (
                project.technologyStack.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-semibold italic">No project tech stack recorded.</span>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Users size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Assigned Team Members</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.teamMembers?.length ? (
                project.teamMembers.map((member, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    {member}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-semibold italic">No team members assigned.</span>
              )}
            </div>
          </div>

          {/* Description Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText size={18} className="text-blue-500" />
              <h3 className="text-base font-bold text-slate-800">Project Description</h3>
            </div>
            <div className="rounded-xl border border-slate-200/40 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed font-medium">
              {project.description || "No project description available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

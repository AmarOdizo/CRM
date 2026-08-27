"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProjects, deleteProject } from "./data";

import ProjectTable from "./projectcomponents/ProjectTable";
import SearchFilter from "./projectcomponents/SearchFilter";
import ExportCSV from "./projectcomponents/ExportCSV";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Project Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all company projects in one place.
          </p>
        </div>

        <Link
          href="/admin1/project-management/add"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Project
        </Link>
      </div>

      {/* Search & Export */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <ExportCSV projects={filteredProjects} />
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading Projects...
          </h2>
        </div>
      ) : (
        <ProjectTable projects={filteredProjects} onDelete={handleDelete} />
      )}
    </div>
  );
}

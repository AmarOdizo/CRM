"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getProjectById } from "../../data";
import StatusBadge from "../../projectcomponents/StatusBadge";

const priorityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-10 shadow-xl">
          <h2 className="text-2xl font-semibold">Loading Project...</h2>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-red-600">Project Not Found</h2>

          <Link
            href="/admin1/project-management"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Project Details</h1>

          <p className="mt-2 text-slate-500">
            Complete information about the selected project.
          </p>
        </div>

        <Link
          href="/admin1/project-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Top */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-4xl font-bold">{project.projectName}</h2>

              <p className="mt-2 text-blue-100">{project.projectCode}</p>

              <p className="text-blue-100">Client : {project.clientName}</p>
            </div>

            <div className="space-y-3">
              <StatusBadge status={project.status} />

              <div
                className={`inline-block rounded-full px-4 py-2 font-semibold ${
                  priorityColors[project.priority]
                }`}
              >
                {project.priority} Priority
              </div>
            </div>
          </div>
        </div>

        {/* Information */}

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <Info label="Project Name" value={project.projectName} />

          <Info label="Project Code" value={project.projectCode} />

          <Info label="Client Name" value={project.clientName} />

          <Info label="Project Manager" value={project.projectManager} />

          <Info label="Budget" value={project.budget} />

          <Info label="Start Date" value={project.startDate} />

          <Info label="End Date" value={project.endDate} />

          <Info
            label="Created Date"
            value={
              project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {/* Team */}

        <div className="border-t p-8">
          <h3 className="mb-5 text-xl font-bold">Team Members</h3>

          <div className="flex flex-wrap gap-3">
            {project.teamMembers?.length ? (
              project.teamMembers.map((member, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700"
                >
                  {member}
                </span>
              ))
            ) : (
              <p>No Team Members</p>
            )}
          </div>
        </div>

        {/* Technology */}

        <div className="border-t p-8">
          <h3 className="mb-5 text-xl font-bold">Technology Stack</h3>

          <div className="flex flex-wrap gap-3">
            {project.technologyStack?.length ? (
              project.technologyStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-100 px-4 py-2 font-medium text-green-700"
                >
                  {tech}
                </span>
              ))
            ) : (
              <p>No Technologies Added</p>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="border-t p-8">
          <h3 className="mb-5 text-xl font-bold">Description</h3>

          <div className="rounded-xl border bg-slate-50 p-5">
            {project.description || "No Description Available"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-500">{label}</p>

      <div className="rounded-xl border bg-slate-50 p-4 font-medium">
        {value || "-"}
      </div>
    </div>
  );
}

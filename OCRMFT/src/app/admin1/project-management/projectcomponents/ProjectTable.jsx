"use client";

import { useState } from "react";
import Link from "next/link";

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

const priorityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export default function ProjectTable({ projects, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Project
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Manager
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Priority
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Duration
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">
                    No Projects Found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {project.projectName}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {project.projectCode}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{project.clientName}</td>

                    <td className="px-6 py-4">{project.projectManager}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          priorityColors[project.priority] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {project.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{project.startDate}</div>
                        <div className="text-gray-400">
                          to {project.endDate}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin1/project-management/view/${project.id}`}
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin1/project-management/edit/${project.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setIsOpen(true);
                          }}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        projectName={selectedProject?.projectName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedProject) {
            onDelete(selectedProject.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}

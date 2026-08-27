"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

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

  const columnDefs = [
    {
      headerName: "Project",
      field: "projectName",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <h3 className="font-semibold text-slate-800">{params.data.projectName}</h3>
          <p className="text-xs text-slate-500 font-mono">{params.data.projectCode}</p>
        </div>
      ),
    },
    {
      headerName: "Client",
      field: "clientName",
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Manager",
      field: "projectManager",
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Priority",
      field: "priority",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              priorityColors[params.value] || "bg-gray-100 text-gray-700"
            }`}
          >
            {params.value}
          </span>
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <StatusBadge status={params.value} />
        </div>
      ),
    },
    {
      headerName: "Duration",
      field: "startDate",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-sm">
          <div>{params.data.startDate}</div>
          <div className="text-gray-400">to {params.data.endDate}</div>
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const project = params.data;
        return (
          <div className="flex items-center gap-2 h-full py-1">
            <Link
              href={`/admin1/project-management/view/${project.id}`}
              className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              View
            </Link>
            <Link
              href={`/admin1/project-management/edit/${project.id}`}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                setSelectedProject(project);
                setIsOpen(true);
              }}
              className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        );
      },
      width: 200,
      suppressMenu: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ag-theme-quartz w-full">
        <AgGridReact
          rowData={projects}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={50}
        />
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

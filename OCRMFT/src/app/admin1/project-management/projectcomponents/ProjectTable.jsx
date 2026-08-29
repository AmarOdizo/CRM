"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Edit2, Trash2, Briefcase } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

const priorityColors = {
  Low: "bg-emerald-50 border-emerald-100 text-emerald-700",
  Medium: "bg-amber-50 border-amber-100 text-amber-700",
  High: "bg-orange-50 border-orange-100 text-orange-700",
  Critical: "bg-rose-50 border-rose-100 text-rose-700",
};

export default function ProjectTable({ projects, onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const columnDefs = [
    {
      headerName: "Project",
      field: "projectName",
      flex: 2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 h-full py-2">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm overflow-hidden border border-white/20">
            <Briefcase size={16} />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <h3 className="font-bold text-slate-700 hover:text-blue-600 transition duration-150">
              {params.data.projectName}
            </h3>
            <p className="text-xs text-slate-400 font-mono font-semibold">
              {params.data.projectCode}
            </p>
          </div>
        </div>
      ),
    },
    {
      headerName: "Client",
      field: "clientName",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-700">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Manager",
      field: "projectManager",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-600">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Priority",
      field: "priority",
      flex: 1,
      minWidth: 110,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <span
            className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${
              priorityColors[params.value] || "bg-slate-50 border-slate-200 text-slate-700"
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
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-xs font-semibold text-slate-600">
          <div>{params.data.startDate}</div>
          <div className="text-slate-400 font-medium">to {params.data.endDate}</div>
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const project = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/project-management/view/${project.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100 cursor-pointer"
              title="Edit Project"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedProject(project);
                setIsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      width: 150,
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
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="ag-theme-quartz min-w-[1000px] w-full">
          <AgGridReact
            rowData={projects}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            rowHeight={65}
            headerHeight={48}
          />
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

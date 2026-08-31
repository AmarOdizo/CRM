"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Eye, Edit2, Trash2, CheckCircle2, FolderKanban } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Link from "next/link";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import DeleteModal from "./DeleteModal";
import ExportCSV from "./ExportCSV";

export default function TaskTable({
  tasks = [],
  onDelete,
  deleteLoading = false,
  onEdit,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    async function loadUsersMap() {
      try {
        const [uRes, eRes] = await Promise.allSettled([
          fetch("http://localhost:5000/api/User").then((r) => r.json()),
          fetch("http://localhost:5000/api/Employee").then((r) => r.json()),
        ]);

        const map = {};
        if (uRes.status === "fulfilled" && Array.isArray(uRes.value?.data)) {
          uRes.value.data.forEach((u) => {
            if (u._id || u.id) map[u._id || u.id] = u;
          });
        }

        if (eRes.status === "fulfilled" && Array.isArray(eRes.value?.data)) {
          eRes.value.data.forEach((e) => {
            const key = e._id || e.id;
            if (key) {
              map[key] = {
                ...e,
                fullName: e.name || e.fullName || "Employee",
              };
            }
          });
        }

        setUsersMap(map);
      } catch (err) {
        console.error("Error loading users map for TaskTable:", err);
      }
    }
    loadUsersMap();
  }, []);

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask || !onDelete) return;
    await onDelete(selectedTask);
    setDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const resolveMemberName = (val, storedName = "") => {
    if (storedName && typeof storedName === "string" && storedName.trim()) {
      return storedName.trim();
    }
    if (!val) return "-";
    if (typeof val === "object" && val !== null) {
      return val.fullName || val.name || val.email || "-";
    }
    if (typeof val === "string" && val.trim()) {
      const cleanVal = val.trim();
      if (usersMap[cleanVal]) {
        const match = usersMap[cleanVal];
        return match.fullName || match.name || match.email || cleanVal;
      }
      return cleanVal;
    }
    return "-";
  };

  const columnDefs = [
    {
      headerName: "Task Description",
      field: "title",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 h-full py-2">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm overflow-hidden border border-white/20">
            <ClipboardList size={16} />
          </div>
          <div className="flex flex-col justify-center leading-tight overflow-hidden">
            <h3 className="font-bold text-slate-700 hover:text-blue-600 transition duration-150 truncate">
              {params.data.title || "Untitled Task"}
            </h3>
            {params.data.description && (
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                {params.data.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      headerName: "Project",
      field: "projectName",
      flex: 1.1,
      minWidth: 140,
      cellRenderer: (params) => {
        const proj = params.data.projectName || params.data.project || "-";
        return (
          <div className="flex items-center h-full">
            <span className="truncate bg-blue-50/80 text-blue-700 font-bold px-2.5 py-1 rounded-lg text-xs border border-blue-100 flex items-center gap-1">
              <FolderKanban size={12} /> {proj}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Assigned To",
      field: "assignedTo",
      flex: 1.2,
      minWidth: 150,
      cellRenderer: (params) => {
        const displayName = resolveMemberName(params.data.assignedTo, params.data.assignedToName);
        return (
          <div className="flex items-center gap-2 h-full text-sm font-bold text-slate-700">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0 border border-blue-200">
              {displayName !== "-" ? displayName[0].toUpperCase() : "U"}
            </div>
            <span className="truncate">{displayName}</span>
          </div>
        );
      },
    },
    {
      headerName: "Assigned By",
      field: "assignedBy",
      flex: 1.2,
      minWidth: 150,
      cellRenderer: (params) => {
        const displayName = resolveMemberName(params.data.assignedBy, params.data.assignedByName);
        return (
          <div className="flex items-center gap-2 h-full text-sm font-bold text-slate-700">
            <div className="h-6 w-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-[10px] font-black shrink-0 border border-cyan-200">
              {displayName !== "-" ? displayName[0].toUpperCase() : "A"}
            </div>
            <span className="truncate">{displayName}</span>
          </div>
        );
      },
    },
    {
      headerName: "Priority",
      field: "priority",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <PriorityBadge priority={params.value} />
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1.1,
      minWidth: 110,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <StatusBadge status={params.value} />
        </div>
      ),
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      flex: 1,
      minWidth: 110,
      cellRenderer: (params) => {
        const val = params.data.dueDate
          ? new Date(params.data.dueDate).toLocaleDateString()
          : "-";
        return (
          <div className="flex items-center h-full text-xs font-semibold text-slate-600">
            {val}
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const task = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/task-assignment/view/${task.id || task._id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100 cursor-pointer"
              title="Edit Task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Task Deliverables</h2>
          <p className="text-xs text-slate-500 font-medium">
            Showing {tasks.length} total tasks assigned.
          </p>
        </div>

        <ExportCSV tasks={tasks} />
      </div>

      <div className="ag-theme-quartz h-[500px] w-full">
        <AgGridReact
          rowData={tasks}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          rowHeight={60}
          headerHeight={48}
        />
      </div>

      {deleteModalOpen && selectedTask && (
        <DeleteModal
          open={deleteModalOpen}
          task={selectedTask}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

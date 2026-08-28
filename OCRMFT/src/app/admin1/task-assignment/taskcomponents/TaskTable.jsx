"use client";

import { useState } from "react";
import { ClipboardList, Eye, Edit2, Trash2, CheckCircle2 } from "lucide-react";
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
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const columnDefs = [
    {
      headerName: "Task Description",
      field: "title",
      flex: 2,
      minWidth: 220,
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
      headerName: "Assigned To",
      field: "assignedTo.fullName",
      flex: 1.2,
      minWidth: 140,
      cellRenderer: (params) => {
        const val = params.data.assignedTo?.fullName || params.data.assignedTo || "-";
        return (
          <div className="flex items-center h-full text-sm font-semibold text-slate-700">
            {val}
          </div>
        );
      },
    },
    {
      headerName: "Priority",
      field: "priority",
      flex: 1,
      minWidth: 110,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <PriorityBadge priority={params.value} />
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
      headerName: "Due Date",
      field: "dueDate",
      flex: 1.2,
      minWidth: 130,
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
              href={`/admin1/task-assignment/view/${task.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/admin1/task-assignment/edit/${task.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
              title="Edit Task"
            >
              <Edit2 size={16} />
            </Link>
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
      width: 140,
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
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Task Deliverables</h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} active
            </p>
          </div>

          <ExportCSV tasks={tasks} fileName="tasks.csv" />
        </div>

        {/* Table */}
        {tasks.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center bg-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100">
              <ClipboardList size={26} />
            </div>

            <h3 className="text-base font-bold text-slate-700">No Tasks Found</h3>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              There are no tasks matching your current filters.
            </p>
          </div>
        ) : (
          <div className="w-full ag-theme-quartz">
            <AgGridReact
              rowData={tasks}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="autoHeight"
              rowHeight={65}
              headerHeight={48}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        task={selectedTask}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </>
  );
}

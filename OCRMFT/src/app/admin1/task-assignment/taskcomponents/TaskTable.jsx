"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import TaskActions from "./TaskActions";
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
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      suppressMenu: true,
      sortable: false,
    },
    {
      headerName: "Task",
      field: "title",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <p className="truncate text-sm font-semibold text-gray-800">
            {params.data.title || "Untitled Task"}
          </p>
          {params.data.description && (
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {params.data.description}
            </p>
          )}
        </div>
      ),
    },
    {
      headerName: "Assigned To",
      field: "assignedTo.fullName",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => {
        return params.data.assignedTo?.fullName || params.data.assignedTo || "-";
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
      minWidth: 120,
      valueGetter: (params) => {
        return params.data.dueDate
          ? new Date(params.data.dueDate).toLocaleDateString()
          : "-";
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-end gap-2 h-full py-1">
          <TaskActions task={params.data} onDelete={params.context.onDeleteClick} />
        </div>
      ),
      width: 120,
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
      <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Task List</h2>

            <p className="mt-1 text-sm text-gray-500">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <ExportCSV tasks={tasks} fileName="tasks.csv" />
        </div>

        {/* Table */}
        {tasks.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <ClipboardList size={28} className="text-gray-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-700">
              No Tasks Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
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
              rowHeight={60}
              headerHeight={50}
              context={{ onDeleteClick: handleDeleteClick }}
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

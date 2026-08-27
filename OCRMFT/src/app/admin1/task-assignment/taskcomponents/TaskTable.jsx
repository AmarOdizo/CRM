"use client";

import { ClipboardList } from "lucide-react";

import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import TaskActions from "./TaskActions";
import DeleteModal from "./DeleteModal";
import ExportCSV from "./ExportCSV";

import { useState } from "react";

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

  return (
    <>
      <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
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
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Task
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Assigned To
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Priority
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* Number */}
                    <td className="px-4 py-4 text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>

                    {/* Task */}
                    <td className="max-w-[280px] px-4 py-4">
                      <div>
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {task.title || "Untitled Task"}
                        </p>

                        {task.description && (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {task.assignedTo?.fullName || task.assignedTo || "-"}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <TaskActions task={task} onDelete={handleDeleteClick} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

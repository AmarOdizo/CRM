"use client";

import { AlertTriangle, X, Trash2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Delete Task</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg
                       text-gray-500 transition
                       hover:bg-gray-100 hover:text-gray-800
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          {/* Warning Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={28} className="text-red-600" />
          </div>

          <h3 className="text-center text-lg font-semibold text-gray-800">
            Are you sure?
          </h3>

          <p className="mt-2 text-center text-sm leading-6 text-gray-500">
            You are about to delete this task. This action cannot be undone.
          </p>

          {/* Task Name */}
          {task && (
            <div className="mt-5 rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Task
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-gray-700">
                {task.title || "Untitled Task"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white
                       px-4 py-2.5 text-sm font-medium text-gray-700
                       transition hover:bg-gray-100
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg
                       bg-red-600 px-4 py-2.5
                       text-sm font-medium text-white
                       transition hover:bg-red-700
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />

            {loading ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

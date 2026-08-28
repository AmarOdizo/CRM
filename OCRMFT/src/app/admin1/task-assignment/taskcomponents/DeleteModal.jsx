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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-800">Delete Task</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle size={26} />
          </div>

          <h3 className="text-lg font-bold text-slate-800">Are you sure?</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            You are about to delete this task. This action cannot be undone and will permanently remove this record.
          </p>

          {/* Task Name */}
          {task && (
            <div className="mt-4 rounded-xl border border-slate-200/55 bg-slate-50/50 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Task Details</span>
              <span className="mt-1 font-bold text-slate-700 block truncate">{task.title || "Untitled Task"}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <Trash2 size={16} />
            <span>{loading ? "Deleting..." : "Delete Task"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

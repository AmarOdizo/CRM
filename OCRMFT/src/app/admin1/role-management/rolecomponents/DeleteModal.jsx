"use client";

import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, roleName, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="rounded-full bg-rose-50 p-2">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Delete Role</h2>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-800">{roleName}</span>? This action cannot be undone and will permanently remove this role and its permissions from the system.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/20 cursor-pointer"
          >
            Delete Role
          </button>
        </div>
      </div>
    </div>
  );
}

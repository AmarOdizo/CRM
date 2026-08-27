"use client";

export default function DeleteModal({ isOpen, onClose, onConfirm, leadName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-red-600">Delete Lead</h2>

        <p className="mt-4 text-gray-600">
          Are you sure you want to delete
          <span className="font-semibold"> {leadName}</span>?
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

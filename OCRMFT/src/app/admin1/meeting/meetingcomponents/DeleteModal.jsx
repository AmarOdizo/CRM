"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import { deleteMeeting } from "../data";

export default function DeleteModal({ isOpen, meeting, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  // ==================================================
  // RESET ERROR WHEN MODAL OPENS
  // ==================================================

  useEffect(() => {
    if (isOpen) {
      setError("");
      setDeleting(false);
    }
  }, [isOpen]);

  // ==================================================
  // CLOSE
  // ==================================================

  const handleClose = () => {
    if (deleting) return;

    setError("");

    onClose?.();
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async () => {
    const meetingId = meeting?._id || meeting?.id;

    if (!meetingId) {
      setError("Meeting ID is missing.");
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteMeeting(meetingId);

      // Parent ko deleted ID bhejo
      onDeleted?.(meetingId);

      // Modal close
      onClose?.();
    } catch (err) {
      console.error("Delete Meeting Error:", err);

      setError(err?.message || "Failed to delete meeting.");
    } finally {
      setDeleting(false);
    }
  };

  // ==================================================
  // MODAL CLOSED
  // ==================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      {/* MODAL */}
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600">
              <Trash2 size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Confirm Deletion
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Meeting Schedule removal
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-rose-600"
              />

              <div className="min-w-0">
                <p className="text-xs font-bold text-rose-800">
                  Are you sure you want to delete this meeting schedule?
                </p>

                {meeting?.title && (
                  <p className="mt-2 truncate text-xs font-extrabold text-rose-900 bg-white/70 border border-rose-100/50 rounded-lg px-2.5 py-1.5 font-mono">
                    "{meeting.title}"
                  </p>
                )}

                <p className="mt-2 text-[10px] leading-relaxed text-rose-600/80 font-medium">
                  The meeting calendar instance and list entry will be permanently removed. This action is irreversible.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-rose-700">{error}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
          {/* CANCEL */}
          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/10 hover:bg-rose-700 transition active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Remove Meeting</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

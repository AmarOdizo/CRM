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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-800">
                Delete Meeting
              </h2>

              <p className="text-xs text-gray-500">
                This action cannot be undone
              </p>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className="px-5 py-5">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  Are you sure you want to delete this meeting?
                </p>

                {meeting?.title && (
                  <p className="mt-2 truncate text-sm font-bold text-red-700">
                    "{meeting.title}"
                  </p>
                )}

                <p className="mt-2 text-xs leading-5 text-red-600">
                  The meeting and its associated information will be permanently
                  removed.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
          {/* CANCEL */}

          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Meeting
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

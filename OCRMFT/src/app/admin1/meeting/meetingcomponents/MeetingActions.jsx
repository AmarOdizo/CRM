"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";

import DeleteModal from "./DeleteModal";
import { deleteMeeting } from "../data";

export default function MeetingActions({ meeting, onDelete }) {
  const router = useRouter();

  // ==================================================
  // STATE
  // ==================================================

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  // ==================================================
  // GET ID
  // ==================================================

  const meetingId = meeting?._id || meeting?.id;

  // ==================================================
  // VIEW
  // ==================================================

  const handleView = () => {
    if (!meetingId) {
      return;
    }

    router.push(`/admin1/meeting/view/${meetingId}`);
  };

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = () => {
    if (!meetingId) {
      return;
    }

    router.push(`/admin1/meeting/edit/${meetingId}`);
  };

  // ==================================================
  // OPEN DELETE MODAL
  // ==================================================

  const handleDeleteClick = () => {
    setDeleteError("");

    setDeleteModalOpen(true);
  };

  // ==================================================
  // CLOSE DELETE MODAL
  // ==================================================

  const handleDeleteCancel = () => {
    if (deleting) {
      return;
    }

    setDeleteModalOpen(false);

    setDeleteError("");
  };

  // ==================================================
  // CONFIRM DELETE
  // ==================================================

  const handleDeleteConfirm = async () => {
    if (!meetingId) {
      setDeleteError("Meeting ID is missing.");

      return;
    }

    try {
      setDeleting(true);

      setDeleteError("");

      await deleteMeeting(meetingId);

      setDeleteModalOpen(false);

      // Parent table refresh
      if (onDelete) {
        onDelete(meetingId);
      }
    } catch (error) {
      console.error("Delete Meeting Error:", error);

      setDeleteError(error?.message || "Failed to delete meeting.");
    } finally {
      setDeleting(false);
    }
  };

  // ==================================================
  // INVALID MEETING
  // ==================================================

  if (!meetingId) {
    return null;
  }

  return (
    <>
      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}

      <div className="flex items-center justify-end gap-1.5">
        {/* VIEW */}

        <button
          type="button"
          onClick={handleView}
          title="View Meeting"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
        >
          <Eye size={17} />
        </button>

        {/* EDIT */}

        <button
          type="button"
          onClick={handleEdit}
          title="Edit Meeting"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-600 transition hover:bg-yellow-100"
        >
          <Pencil size={17} />
        </button>

        {/* DELETE */}

        <button
          type="button"
          onClick={handleDeleteClick}
          title="Delete Meeting"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      <DeleteModal
        open={deleteModalOpen}
        meeting={meeting}
        loading={deleting}
        error={deleteError}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

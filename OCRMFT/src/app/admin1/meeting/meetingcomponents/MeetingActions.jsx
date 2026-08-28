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

      <div className="flex items-center justify-end gap-1">
        {/* VIEW */}
        <button
          type="button"
          onClick={handleView}
          title="View Details"
          className="p-1.5 rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition duration-150 cursor-pointer"
        >
          <Eye size={15} />
        </button>

        {/* EDIT */}
        <button
          type="button"
          onClick={handleEdit}
          title="Edit Details"
          className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition duration-150 cursor-pointer"
        >
          <Pencil size={15} />
        </button>

        {/* DELETE */}
        <button
          type="button"
          onClick={handleDeleteClick}
          title="Delete Meeting"
          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition duration-150 cursor-pointer"
        >
          <Trash2 size={15} />
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

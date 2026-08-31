"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function MeetingActions({ meeting, onDelete, onEdit }) {
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const meetingId = meeting?._id || meeting?.id;

  const handleView = () => {
    if (!meetingId) return;
    router.push(`/admin1/meeting/view/${meetingId}`);
  };

  const handleEdit = () => {
    if (!meetingId) return;

    if (onEdit) {
      onEdit(meeting);
    } else {
      router.push(`/admin1/meeting/edit/${meetingId}`);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  if (!meetingId) {
    return null;
  }

  return (
    <>
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

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        meeting={meeting}
        onClose={() => setDeleteModalOpen(false)}
        onDeleted={(deletedId) => {
          setDeleteModalOpen(false);
          if (onDelete) {
            onDelete(deletedId);
          }
        }}
      />
    </>
  );
}

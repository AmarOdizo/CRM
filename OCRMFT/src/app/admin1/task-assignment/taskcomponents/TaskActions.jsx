"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function TaskActions({ task, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {/* View */}
      <Link
        href={`/admin1/task-assignment/view/${task.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg
                   bg-blue-50 text-blue-600 transition
                   hover:bg-blue-600 hover:text-white"
        title="View Task"
      >
        <Eye size={17} />
      </Link>

      {/* Edit */}
      <Link
        href={`/admin1/task-assignment/edit/${task.id}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg
                   bg-amber-50 text-amber-600 transition
                   hover:bg-amber-500 hover:text-white"
        title="Edit Task"
      >
        <Pencil size={17} />
      </Link>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(task)}
        className="flex h-9 w-9 items-center justify-center rounded-lg
                   bg-red-50 text-red-600 transition
                   hover:bg-red-600 hover:text-white"
        title="Delete Task"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

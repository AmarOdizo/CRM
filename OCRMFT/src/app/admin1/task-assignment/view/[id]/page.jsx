"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Pencil,
  ClipboardList,
  Loader2,
  CalendarDays,
  User,
  Flag,
  CircleDot,
  FileText,
} from "lucide-react";

import StatusBadge from "../../taskcomponents/StatusBadge";
import PriorityBadge from "../../taskcomponents/PriorityBadge";
import { getTaskById } from "../../data";

export default function ViewTaskPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET TASK
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTaskById(id);
        setTask(data?.data || data);
      } catch (error) {
        console.error("Fetch task error:", error);

        setError(
          error.message || "Something went wrong while loading the task.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-600" />

          <p className="text-sm text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <ClipboardList size={28} className="text-red-600" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Task Not Found
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "The requested task could not be found."}
          </p>

          <Link
            href="/admin1/task-assignment"
            className="mt-5 inline-flex items-center gap-2 rounded-lg
                       bg-blue-600 px-4 py-2.5
                       text-sm font-medium text-white
                       transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* =========================
          HEADER
      ========================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <ClipboardList size={22} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
              Task Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View complete information about this task.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin1/task-assignment"
            className="inline-flex items-center gap-2 rounded-lg
                       border border-gray-300 bg-white
                       px-4 py-2.5 text-sm font-medium
                       text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          <Link
            href={`/admin1/task-assignment/edit/${task.id}`}
            className="inline-flex items-center gap-2 rounded-lg
                       bg-blue-600 px-4 py-2.5
                       text-sm font-medium text-white
                       transition hover:bg-blue-700"
          >
            <Pencil size={17} />
            Edit
          </Link>
        </div>
      </div>

      {/* =========================
          TASK CARD
      ========================= */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Title Section */}
        <div className="border-b border-gray-200 px-5 py-6 md:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Task
              </p>

              <h2 className="break-words text-2xl font-bold text-gray-800">
                {task.title || "Untitled Task"}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={task.status} />

              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-7">
          {/* Assigned To */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <User size={19} className="text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Assigned To
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {task.assignedTo?.fullName || task.assignedTo || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <CalendarDays size={19} className="text-purple-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Due Date
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CircleDot size={19} className="text-green-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <div className="mt-1">
                  <StatusBadge status={task.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Flag size={19} className="text-orange-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Priority
                </p>

                <div className="mt-1">
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-gray-200 px-5 py-6 md:px-7">
          <div className="mb-3 flex items-center gap-2">
            <FileText size={19} className="text-gray-500" />

            <h3 className="text-base font-semibold text-gray-800">
              Description
            </h3>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 border-t border-gray-200 md:grid-cols-2">
          <div className="border-b border-gray-200 px-5 py-4 md:border-b-0 md:border-r md:px-7">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Task ID
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              #{task.id}
            </p>
          </div>

          <div className="px-5 py-4 md:px-7">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

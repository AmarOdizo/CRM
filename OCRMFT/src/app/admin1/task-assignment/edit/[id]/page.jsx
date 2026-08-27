"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardEdit, Loader2 } from "lucide-react";

import TaskForm from "../../taskcomponents/TaskForm";
import { getTaskById, updateTask } from "../../data";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GET TASK BY ID
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTaskById(id);

        // Supports both:
        // { task: {...} }
        // OR
        // {...}
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
  // UPDATE TASK
  // =========================
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await updateTask(id, formData);

      router.push("/admin1/task-assignment");
    } catch (error) {
      console.error("Update task error:", error);

      setError(
        error.message || "Something went wrong while updating the task.",
      );
    } finally {
      setSaving(false);
    }
  };

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
  // ERROR / TASK NOT FOUND
  // =========================
  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Unable to Load Task
          </h2>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <Link
            href="/admin1/task-assignment"
            className="mt-5 inline-flex items-center gap-2 rounded-lg
                       bg-blue-600 px-4 py-2.5 text-sm font-medium
                       text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <ClipboardEdit size={22} className="text-amber-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
              Edit Task
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update the task information below.
            </p>
          </div>
        </div>

        {/* Back */}
        <Link
          href="/admin1/task-assignment"
          className="inline-flex w-fit items-center gap-2 rounded-lg
                     border border-gray-300 bg-white px-4 py-2.5
                     text-sm font-medium text-gray-700
                     transition hover:bg-gray-100"
        >
          <ArrowLeft size={17} />
          Back to Tasks
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          loading={saving}
          isEdit
        />
      </div>
    </div>
  );
}

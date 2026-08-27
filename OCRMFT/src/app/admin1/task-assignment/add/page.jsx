"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardPlus } from "lucide-react";

import TaskForm from "../taskcomponents/TaskForm";
import { createTask } from "../data";

export default function AddTaskPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      await createTask(formData);

      router.push("/admin1/task-assignment");
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error.message || "Something went wrong while creating the task.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <ClipboardPlus size={22} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
              Add New Task
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and assign a new task.
            </p>
          </div>
        </div>

        {/* Back Button */}
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
        <TaskForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

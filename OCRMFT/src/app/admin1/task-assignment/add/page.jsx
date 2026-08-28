"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add New Task</h1>
          <p className="mt-1 text-slate-500 font-medium">Create a new task deliverable and assign ownership.</p>
        </div>

        {/* Back Button */}
        <Link
          href="/admin1/task-assignment"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer w-fit"
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-600 font-semibold text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="max-w-4xl">
        <TaskForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

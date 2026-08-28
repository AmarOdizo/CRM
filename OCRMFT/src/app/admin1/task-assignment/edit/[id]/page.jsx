"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Task...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve task details.</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-rose-600">Unable to Load Task</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">{error}</p>

          <Link
            href="/admin1/task-assignment"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Tasks</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Task</h1>
          <p className="mt-1 text-slate-500 font-medium">Update the task information and deadlines.</p>
        </div>

        {/* Back */}
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

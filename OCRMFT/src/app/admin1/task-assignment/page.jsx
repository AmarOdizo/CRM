"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { getTasks, deleteTask } from "./data";
import { filterTasks } from "./utils";
import TaskTable from "./taskcomponents/TaskTable";
import SearchFilter from "./taskcomponents/SearchFilter";

export default function TaskAssignmentPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const data = res.data || res;
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (task) => {
    try {
      setDeleteLoading(true);
      await deleteTask(task.id || task._id);
      await fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      alert(error.message || "Failed to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTasks = filterTasks(tasks, { search, status, priority });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
            <ClipboardList size={22} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
              Task Assignment
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Assign and track tasks for employees.
            </p>
          </div>
        </div>

        <Link
          href="/admin1/task-assignment/add"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          + Add Task
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-lg font-semibold shadow-sm">
          Loading Tasks...
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
}

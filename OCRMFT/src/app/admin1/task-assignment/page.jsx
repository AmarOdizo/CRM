"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus, AlertCircle, Clock, CheckCircle2, ListTodo } from "lucide-react";

import { getTasks, deleteTask } from "./data";
import { filterTasks } from "./utils";
import TaskTable from "./taskcomponents/TaskTable";
import SearchFilter from "./taskcomponents/SearchFilter";
import TaskFormModal from "./taskcomponents/TaskFormModal";

export default function TaskAssignmentPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  // Calculate statistics
  const totalTasks = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Task Assignment</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Create, assign, track, and manage team task deliverables.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTaskId(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer w-fit"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Tasks",
            val: totalTasks,
            icon: ListTodo,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "Pending",
            val: pending,
            icon: AlertCircle,
            color: "text-rose-600 bg-rose-50/50 border-rose-200/50",
          },
          {
            title: "In Progress",
            val: inProgress,
            icon: Clock,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
          {
            title: "Completed",
            val: completed,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">
                  {loading ? "..." : card.val}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500 font-semibold shadow-sm animate-pulse">
          Loading Tasks...
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
          onEdit={(task) => {
            setSelectedTaskId(task.id);
            setModalOpen(true);
          }}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        taskId={selectedTaskId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchTasks();
        }}
      />
    </div>
  );
}

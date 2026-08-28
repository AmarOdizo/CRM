"use client";

import { useState, useEffect } from "react";
import { Save, X, ClipboardList, User, Calendar } from "lucide-react";
import { formatDateForInput } from "../utils";

export default function TaskForm({
  initialData = {},
  onSubmit,
  submitText = "Assign Task",
  loading = false,
}) {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/User");
        const resData = await response.json();
        setUsers(resData.data || []);
      } catch (error) {
        console.error("Error loading users for task form:", error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsersList();
  }, []);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
    assignedBy: initialData.assignedBy?._id || initialData.assignedBy || "",
    priority: initialData.priority || "Medium",
    status: initialData.status || "Pending",
    startDate: formatDateForInput(initialData.startDate),
    dueDate: formatDateForInput(initialData.dueDate),
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Task title must contain at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please select a team member";
    }

    if (!formData.assignedBy) {
      newErrors.assignedBy = "Assigned by is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      formData.dueDate < formData.startDate
    ) {
      newErrors.dueDate = "Due date cannot be before start date";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo,
      assignedBy: formData.assignedBy,
      priority: formData.priority,
      status: formData.status,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
    };

    if (onSubmit) {
      onSubmit(taskData);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      assignedBy: "",
      priority: "Medium",
      status: "Pending",
      startDate: "",
      dueDate: "",
    });

    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm"
    >
      <div className="p-8 space-y-8">
        {/* Section 1: Task Details */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <ClipboardList size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Task Specifications</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                  errors.title
                    ? "border-rose-300 focus:ring-4 focus:ring-rose-50/50 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the task details..."
                className={`w-full px-4 py-3 rounded-xl border outline-none resize-none transition ${
                  errors.description
                    ? "border-rose-300 focus:ring-4 focus:ring-rose-50/50 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Task Assignment */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <User size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Assignment & Ownership</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Assign To <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={`w-full py-3 pl-4 pr-10 rounded-xl border bg-white outline-none transition appearance-none cursor-pointer ${
                    errors.assignedTo
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  }`}
                >
                  <option value="">Select team member</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName} ({u.role || "User"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              {errors.assignedTo && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.assignedTo}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned By <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="assignedBy"
                  value={formData.assignedBy}
                  onChange={handleChange}
                  className={`w-full py-3 pl-4 pr-10 rounded-xl border bg-white outline-none transition appearance-none cursor-pointer ${
                    errors.assignedBy
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  }`}
                >
                  <option value="">Select admin / manager</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName} ({u.role || "User"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              {errors.assignedBy && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.assignedBy}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Parameters & Schedule */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Parameters & Deadlines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Priority
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer text-sm text-slate-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer text-sm text-slate-800"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition text-sm text-slate-800 ${
                  errors.startDate
                    ? "border-rose-300 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.startDate && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition text-sm text-slate-800 ${
                  errors.dueDate
                    ? "border-rose-300 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.dueDate && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.dueDate}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <X size={16} />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save size={16} />
          <span>{loading ? "Saving..." : submitText}</span>
        </button>
      </div>
    </form>
  );
}

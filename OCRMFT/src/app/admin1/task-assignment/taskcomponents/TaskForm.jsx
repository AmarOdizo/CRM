"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
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

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================

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

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      This sends exactly the structure
      expected by backend Task.js
    */

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

  // ==========================================
  // RESET
  // ==========================================

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
      className="bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      {/* ======================================
          FORM HEADER
      ====================================== */}

      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Task Information
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enter the details of the task assignment
        </p>
      </div>

      {/* ======================================
          FORM BODY
      ====================================== */}

      <div className="p-6 space-y-6">
        {/* --------------------------------------
            TASK TITLE
        -------------------------------------- */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
              errors.title
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* --------------------------------------
            DESCRIPTION
        -------------------------------------- */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the task..."
            className={`w-full px-4 py-3 rounded-xl border outline-none resize-none transition ${
              errors.description
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* --------------------------------------
            ASSIGNED TO + ASSIGNED BY
        -------------------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Assigned To */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To <span className="text-red-500">*</span>
            </label>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition ${
                errors.assignedTo
                  ? "border-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            >
              <option value="">Select team member</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} ({u.role || "User"})
                </option>
              ))}
            </select>

            {errors.assignedTo && (
              <p className="text-xs text-red-500 mt-1">{errors.assignedTo}</p>
            )}
          </div>

          {/* Assigned By */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned By <span className="text-red-500">*</span>
            </label>

            <select
              name="assignedBy"
              value={formData.assignedBy}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition ${
                errors.assignedBy
                  ? "border-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            >
              <option value="">Select admin / manager</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} ({u.role || "User"})
                </option>
              ))}
            </select>

            {errors.assignedBy && (
              <p className="text-xs text-red-500 mt-1">{errors.assignedBy}</p>
            )}
          </div>
        </div>

        {/* --------------------------------------
            PRIORITY + STATUS
        -------------------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Priority */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Pending">Pending</option>

              <option value="In Progress">In Progress</option>

              <option value="Completed">Completed</option>

              <option value="Overdue">Overdue</option>

              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* --------------------------------------
            START DATE + DUE DATE
        -------------------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Start Date */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                errors.startDate
                  ? "border-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* Due Date */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                errors.dueDate
                  ? "border-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* ======================================
          FORM FOOTER
      ====================================== */}

      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50"
        >
          <X size={17} />
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={17} />

          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

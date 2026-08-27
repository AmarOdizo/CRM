import { TASK_STATUS, TASK_PRIORITY } from "./data";

// ==========================================
// Format Date
// ==========================================

export function formatTaskDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ==========================================
// Format Date For Input
// ==========================================

export function formatDateForInput(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}

// ==========================================
// Search Tasks
// ==========================================

export function searchTasks(tasks = [], search = "") {
  const searchValue = search.trim().toLowerCase();

  if (!searchValue) {
    return tasks;
  }

  return tasks.filter((task) => {
    const title = String(task.title || "").toLowerCase();
    const description = String(task.description || "").toLowerCase();

    const assignedTo = String(task.assignedTo || "").toLowerCase();

    return (
      title.includes(searchValue) ||
      description.includes(searchValue) ||
      assignedTo.includes(searchValue)
    );
  });
}

// ==========================================
// Filter Tasks
// ==========================================

export function filterTasks(
  tasks = [],
  { search = "", status = "All", priority = "All" } = {},
) {
  let filteredTasks = Array.isArray(tasks) ? [...tasks] : [];

  // Search
  filteredTasks = searchTasks(filteredTasks, search);

  // Status
  if (status && status !== "All") {
    filteredTasks = filteredTasks.filter((task) => task.status === status);
  }

  // Priority
  if (priority && priority !== "All") {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  return filteredTasks;
}

// ==========================================
// Validate Task
// ==========================================

export function validateTask(task = {}) {
  const errors = {};

  if (!task.title || !task.title.trim()) {
    errors.title = "Task title is required.";
  }

  if (task.title && task.title.trim().length < 2) {
    errors.title = "Task title must contain at least 2 characters.";
  }

  if (!task.assignedTo || !String(task.assignedTo).trim()) {
    errors.assignedTo = "Assigned user is required.";
  }

  if (task.status && !Object.values(TASK_STATUS).includes(task.status)) {
    errors.status = "Invalid task status.";
  }

  if (task.priority && !Object.values(TASK_PRIORITY).includes(task.priority)) {
    errors.priority = "Invalid task priority.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ==========================================
// Create Empty Task
// ==========================================

export function createEmptyTask() {
  return {
    title: "",
    description: "",
    assignedTo: "",
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: "",
  };
}

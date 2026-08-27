// API Base URL
export const TASK_API = "http://localhost:5000/api/Task";

// ==========================================
// GET ALL TASKS
// ==========================================

export async function getTasks() {
  const response = await fetch(TASK_API, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch tasks.");
  }

  if (data?.data && Array.isArray(data.data)) {
    data.data = data.data.map(task => ({
      ...task,
      id: task._id
    }));
  }

  return data;
}

// ==========================================
// GET SINGLE TASK
// ==========================================

export async function getTaskById(id) {
  const response = await fetch(`${TASK_API}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch task.");
  }

  if (data?.data) {
    data.data = {
      ...data.data,
      id: data.data._id
    };
  }

  return data;
}

// ==========================================
// CREATE TASK
// ==========================================

export async function createTask(taskData) {
  const response = await fetch(TASK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create task.");
  }

  return data;
}

// ==========================================
// UPDATE TASK
// ==========================================

export async function updateTask(id, taskData) {
  const response = await fetch(`${TASK_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update task.");
  }

  return data;
}

// ==========================================
// DELETE TASK
// ==========================================

export async function deleteTask(id) {
  const response = await fetch(`${TASK_API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete task.");
  }

  return data;
}

// ==========================================
// TASK CONSTANTS
// ==========================================

export const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

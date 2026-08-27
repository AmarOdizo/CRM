const API_URL = "http://localhost:5000/api/Meeting";

// ==========================================
// GET ALL MEETINGS
// ==========================================

export async function getMeetings() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch meetings.");
  }

  return result;
}

// ==========================================
// GET MEETING BY ID
// ==========================================

export async function getMeetingById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch meeting.");
  }

  return result;
}

// ==========================================
// CREATE MEETING
// ==========================================

export async function createMeeting(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create meeting.");
  }

  return result;
}

// ==========================================
// UPDATE MEETING
// ==========================================

export async function updateMeeting(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update meeting.");
  }

  return result;
}

// ==========================================
// DELETE MEETING
// ==========================================

export async function deleteMeeting(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to delete meeting.");
  }

  return result;
}

// ==========================================
// GET MEETINGS BY CLIENT
// ==========================================

export async function getMeetingsByClient(clientId) {
  const response = await fetch(`${API_URL}/client/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch client meetings.");
  }

  return result;
}

// ==========================================
// GET MEETINGS BY PROJECT
// ==========================================

export async function getMeetingsByProject(projectId) {
  const response = await fetch(`${API_URL}/project/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch project meetings.");
  }

  return result;
}

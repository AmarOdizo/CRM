// ======================================================
// MEETING UTILITY FUNCTIONS
// ======================================================

// ======================================================
// 1. SAFE STRING
// ======================================================

export function safeString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

// ======================================================
// 2. FORMAT MEETING DATE
// Example:
// 2026-08-25
//      ↓
// 25 Aug 2026
// ======================================================

export function formatMeetingDate(date) {
  if (!date) {
    return "-";
  }

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

// ======================================================
// 3. FORMAT DATE FOR INPUT
// Example:
// 2026-08-25T00:00:00.000Z
//      ↓
// 2026-08-25
// ======================================================

export function formatDateForInput(date) {
  if (!date) {
    return "";
  }

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// ======================================================
// 4. FORMAT TIME
// Example:
// 10:00
//      ↓
// 10:00 AM
// ======================================================

export function formatMeetingTime(time) {
  if (!time) {
    return "-";
  }

  const value = String(time);

  const parts = value.split(":");

  if (parts.length < 2) {
    return value;
  }

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (isNaN(hours)) {
    return value;
  }

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

// ======================================================
// 5. CALCULATE MEETING DURATION
// Example:
// 10:00 → 11:30
//      ↓
// 1h 30m
// ======================================================

export function calculateMeetingDuration(startTime, endTime) {
  if (!startTime || !endTime) {
    return "-";
  }

  const startParts = String(startTime).split(":").map(Number);

  const endParts = String(endTime).split(":").map(Number);

  if (startParts.length < 2 || endParts.length < 2) {
    return "-";
  }

  const startMinutes = startParts[0] * 60 + startParts[1];

  const endMinutes = endParts[0] * 60 + endParts[1];

  let difference = endMinutes - startMinutes;

  // Meeting crosses midnight
  if (difference < 0) {
    difference += 24 * 60;
  }

  const hours = Math.floor(difference / 60);

  const minutes = difference % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

// ======================================================
// 6. MEETING STATUS
// ======================================================

export function getMeetingStatus(meeting) {
  return meeting?.status || "Scheduled";
}

// ======================================================
// 7. NORMALIZE STATUS
// ======================================================

export function normalizeMeetingStatus(status) {
  if (!status) {
    return "Scheduled";
  }

  return String(status).trim().toLowerCase();
}

// ======================================================
// 8. STATUS LABEL
// ======================================================

export function getMeetingStatusLabel(status) {
  const normalized = normalizeMeetingStatus(status);

  const labels = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    rescheduled: "Rescheduled",
  };

  return labels[normalized] || "Scheduled";
}

// ======================================================
// 9. STATUS STYLE
// ======================================================

export function getMeetingStatusStyle(status) {
  const normalized = normalizeMeetingStatus(status);

  const styles = {
    scheduled: "bg-blue-50 text-blue-700 border border-blue-100",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 border border-rose-100",
    rescheduled: "bg-amber-50 text-amber-700 border border-amber-100",
  };

  return styles[normalized] || "bg-slate-50 text-slate-600 border border-slate-200/60";
}

// ======================================================
// 10. MEETING TYPE
// ======================================================

export function getMeetingType(meeting) {
  return meeting?.meetingType || "Online";
}

// ======================================================
// 11. NORMALIZE MEETING TYPE
// ======================================================

export function normalizeMeetingType(type) {
  if (!type) {
    return "online";
  }

  return String(type).trim().toLowerCase();
}

// ======================================================
// 12. MEETING TYPE STYLE
// ======================================================

export function getMeetingTypeStyle(type) {
  const normalized = normalizeMeetingType(type);

  const styles = {
    online: "bg-purple-50 text-purple-700 border border-purple-100",
    offline: "bg-orange-50 text-orange-700 border border-orange-100",
    phone: "bg-green-50 text-green-700 border border-green-100",
  };

  return styles[normalized] || "bg-slate-50 text-slate-600 border border-slate-200/60";
}

// ======================================================
// 13. GET MEETING LINK
// ======================================================

export function getMeetingLink(meeting) {
  return meeting?.meetingLink || "";
}

// ======================================================
// 14. CHECK ONLINE MEETING
// ======================================================

export function isOnlineMeeting(meeting) {
  return normalizeMeetingType(meeting?.meetingType) === "online";
}

// ======================================================
// 15. CHECK OFFLINE MEETING
// ======================================================

export function isOfflineMeeting(meeting) {
  return normalizeMeetingType(meeting?.meetingType) === "offline";
}

// ======================================================
// 16. PARTICIPANTS COUNT
// ======================================================

export function getParticipantsCount(meeting) {
  if (!Array.isArray(meeting?.participants)) {
    return 0;
  }

  return meeting.participants.length;
}

// ======================================================
// 17. PARTICIPANTS DISPLAY
// ======================================================

export function getParticipantsNames(participants) {
  if (!Array.isArray(participants) || participants.length === 0) {
    return "No participants";
  }

  return participants
    .map((participant) => participant?.name || participant?.email || "")
    .filter(Boolean)
    .join(", ");
}

// ======================================================
// 18. FIRST PARTICIPANT
// ======================================================

export function getFirstParticipant(participants) {
  if (!Array.isArray(participants) || participants.length === 0) {
    return null;
  }

  return participants[0];
}

// ======================================================
// 19. MEETING LOCATION
// ======================================================

export function getMeetingLocation(meeting) {
  if (normalizeMeetingType(meeting?.meetingType) === "online") {
    return meeting?.meetingLink || "Online Meeting";
  }

  return meeting?.location || "Location not specified";
}

// ======================================================
// 20. CHECK UPCOMING MEETING
// ======================================================

export function isUpcomingMeeting(meeting) {
  if (!meeting?.meetingDate) {
    return false;
  }

  if (meeting?.status === "Cancelled" || meeting?.status === "Completed") {
    return false;
  }

  const meetingDate = new Date(meeting.meetingDate);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  meetingDate.setHours(0, 0, 0, 0);

  return meetingDate >= today;
}

// ======================================================
// 21. CHECK TODAY'S MEETING
// ======================================================

export function isTodayMeeting(meeting) {
  if (!meeting?.meetingDate) {
    return false;
  }

  const meetingDate = new Date(meeting.meetingDate);

  const today = new Date();

  return (
    meetingDate.getFullYear() === today.getFullYear() &&
    meetingDate.getMonth() === today.getMonth() &&
    meetingDate.getDate() === today.getDate()
  );
}

// ======================================================
// 22. SEARCH MEETING
// ======================================================

export function searchMeeting(meeting, search) {
  if (!search) {
    return true;
  }

  const query = String(search).toLowerCase().trim();

  if (!query) {
    return true;
  }

  const searchableText = [
    meeting?.title,
    meeting?.description,
    meeting?.status,
    meeting?.meetingType,
    meeting?.location,
    meeting?.meetingLink,
    meeting?.notes,

    ...(Array.isArray(meeting?.participants)
      ? meeting.participants.flatMap((participant) => [
          participant?.name,
          participant?.email,
        ])
      : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

// ======================================================
// 23. FILTER BY STATUS
// ======================================================

export function filterByMeetingStatus(meetings, status) {
  if (!Array.isArray(meetings)) {
    return [];
  }

  if (!status || status === "All") {
    return meetings;
  }

  return meetings.filter((meeting) => meeting?.status === status);
}

// ======================================================
// 24. FILTER BY TYPE
// ======================================================

export function filterByMeetingType(meetings, type) {
  if (!Array.isArray(meetings)) {
    return [];
  }

  if (!type || type === "All") {
    return meetings;
  }

  return meetings.filter((meeting) => meeting?.meetingType === type);
}

// ======================================================
// 25. SORT BY DATE & TIME
// ======================================================

export function sortMeetingsByDate(meetings, direction = "asc") {
  if (!Array.isArray(meetings)) {
    return [];
  }

  return [...meetings].sort((a, b) => {
    const dateA = new Date(
      `${formatDateForInput(a?.meetingDate)}T${a?.startTime || "00:00"}`,
    );

    const dateB = new Date(
      `${formatDateForInput(b?.meetingDate)}T${b?.startTime || "00:00"}`,
    );

    const result = dateA - dateB;

    return direction === "desc" ? -result : result;
  });
}

// ======================================================
// 26. VALIDATE TIME
// ======================================================

export function isValidMeetingTime(startTime, endTime) {
  if (!startTime || !endTime) {
    return false;
  }

  const start = String(startTime);

  const end = String(endTime);

  return start < end;
}

// ======================================================
// 27. VALIDATE MEETING
// ======================================================

export function validateMeeting(data) {
  const errors = {};

  if (!data?.title?.trim()) {
    errors.title = "Meeting title is required.";
  }

  if (!data?.meetingDate) {
    errors.meetingDate = "Meeting date is required.";
  }

  if (!data?.startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!data?.endTime) {
    errors.endTime = "End time is required.";
  }

  if (
    data?.startTime &&
    data?.endTime &&
    !isValidMeetingTime(data.startTime, data.endTime)
  ) {
    errors.endTime = "End time must be after start time.";
  }

  if (data?.meetingType === "Online" && !data?.meetingLink?.trim()) {
    errors.meetingLink = "Meeting link is required for online meetings.";
  }

  if (data?.meetingType === "Offline" && !data?.location?.trim()) {
    errors.location = "Location is required for offline meetings.";
  }

  return errors;
}

// ======================================================
// 28. CHECK VALIDATION
// ======================================================

export function hasValidationErrors(errors) {
  return Object.keys(errors || {}).length > 0;
}

// ======================================================
// 29. MEETING SUMMARY COUNTS
// ======================================================

export function getMeetingSummary(meetings = []) {
  const summary = {
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  };

  if (!Array.isArray(meetings)) {
    return summary;
  }

  summary.total = meetings.length;

  meetings.forEach((meeting) => {
    const status = String(meeting?.status || "").toLowerCase();

    if (status === "completed") {
      summary.completed += 1;
    } else if (status === "cancelled") {
      summary.cancelled += 1;
    }

    if (isTodayMeeting(meeting)) {
      summary.today += 1;
    }

    if (isUpcomingMeeting(meeting)) {
      summary.upcoming += 1;
    }
  });

  return summary;
}

// ======================================================
// 30. CHECK IF MEETING HAS EXPIRED (AFTER END TIME)
// ======================================================

export function isMeetingExpired(meetingDate, endTime) {
  if (!meetingDate) {
    return false;
  }

  try {
    const parsedDate = new Date(meetingDate);

    if (isNaN(parsedDate.getTime())) {
      return false;
    }

    let hours = 23;
    let minutes = 59;

    if (endTime && typeof endTime === "string") {
      const timeMatch = endTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        const m = parseInt(timeMatch[2], 10);
        const period = timeMatch[3];

        if (period) {
          if (period.toUpperCase() === "PM" && h < 12) h += 12;
          if (period.toUpperCase() === "AM" && h === 12) h = 0;
        }
        hours = h;
        minutes = m;
      }
    }

    const expirationDate = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      hours,
      minutes,
      59
    );

    const now = new Date();

    return now > expirationDate;
  } catch {
    return false;
  }
}


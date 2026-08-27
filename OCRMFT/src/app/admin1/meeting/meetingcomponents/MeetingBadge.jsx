"use client";

import {
  Video,
  MapPin,
  Phone,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  RefreshCcw,
} from "lucide-react";

import {
  getMeetingStatusLabel,
  getMeetingStatusStyle,
  getMeetingType,
  getMeetingTypeStyle,
} from "../utils";

// ======================================================
// STATUS BADGE
// ======================================================

export function MeetingStatusBadge({ status }) {
  const label = getMeetingStatusLabel(status);

  const style = getMeetingStatusStyle(status);

  const icons = {
    Scheduled: CalendarCheck,
    Completed: CheckCircle2,
    Cancelled: XCircle,
    Rescheduled: RefreshCcw,
  };

  const Icon = icons[label] || CalendarCheck;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      <Icon size={13} />

      {label}
    </span>
  );
}

// ======================================================
// MEETING TYPE BADGE
// ======================================================

export function MeetingTypeBadge({ type }) {
  const meetingType = type || "Online";

  const style = getMeetingTypeStyle(meetingType);

  const icons = {
    Online: Video,
    Offline: MapPin,
    Phone: Phone,
  };

  const Icon = icons[meetingType] || Video;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      <Icon size={13} />

      {meetingType}
    </span>
  );
}

// ======================================================
// COMBINED BADGE
// ======================================================

export default function MeetingBadge({ meeting }) {
  if (!meeting) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MeetingStatusBadge status={meeting.status} />

      <MeetingTypeBadge type={getMeetingType(meeting)} />
    </div>
  );
}

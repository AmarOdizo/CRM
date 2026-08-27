"use client";

import {
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Users,
  Video,
} from "lucide-react";

import {
  calculateMeetingDuration,
  formatMeetingDate,
  formatMeetingTime,
  getMeetingLocation,
} from "../utils";

import MeetingBadge from "./MeetingBadge";
import MeetingActions from "./MeetingActions";

export default function MeetingTable({
  meetings = [],
  loading = false,
  onDelete,
}) {
  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">Loading meetings...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // EMPTY
  // ==================================================

  if (!meetings.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <CalendarDays size={26} />
          </div>

          <h3 className="text-lg font-bold text-gray-800">No Meetings Found</h3>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            There are no meetings matching your current search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ==================================================
          TABLE HEADER
      ================================================== */}

      <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Meetings</h2>

          <p className="text-xs text-gray-500">
            {meetings.length} meeting
            {meetings.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* ==================================================
          DESKTOP TABLE
      ================================================== */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Meeting
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Date & Time
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Participants
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {meetings.map((meeting) => {
              const meetingId = meeting?._id || meeting?.id;

              const participants = Array.isArray(meeting?.participants)
                ? meeting.participants
                : [];

              return (
                <tr key={meetingId} className="transition hover:bg-gray-50">
                  {/* ==================================
                        MEETING
                    =================================== */}

                  <td className="px-5 py-4">
                    <div className="max-w-[260px]">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {meeting?.title || "Untitled Meeting"}
                      </p>

                      {meeting?.description && (
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {meeting.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* ==================================
                        DATE & TIME
                    =================================== */}

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <CalendarDays size={15} className="text-blue-500" />

                        {formatMeetingDate(meeting?.meetingDate)}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} className="text-gray-400" />

                        <span>
                          {formatMeetingTime(meeting?.startTime)}
                          {" - "}
                          {formatMeetingTime(meeting?.endTime)}
                        </span>
                      </div>

                      <span className="inline-block rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                        {calculateMeetingDuration(
                          meeting?.startTime,
                          meeting?.endTime,
                        )}
                      </span>
                    </div>
                  </td>

                  {/* ==================================
                        TYPE
                    =================================== */}

                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <MeetingBadge meeting={meeting} />

                      {meeting?.meetingType === "Online" &&
                        meeting?.meetingLink && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Join Meeting
                            <ExternalLink size={12} />
                          </a>
                        )}

                      {meeting?.meetingType === "Offline" &&
                        meeting?.location && (
                          <div className="flex max-w-[180px] items-center gap-1 text-xs text-gray-500">
                            <MapPin size={12} />

                            <span className="truncate">{meeting.location}</span>
                          </div>
                        )}
                    </div>
                  </td>

                  {/* ==================================
                        PARTICIPANTS
                    =================================== */}

                  <td className="px-5 py-4">
                    {participants.length > 0 ? (
                      <div className="flex max-w-[220px] items-start gap-2">
                        <Users
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div className="min-w-0">
                          {participants
                            .slice(0, 2)
                            .map((participant, index) => (
                              <div
                                key={index}
                                className="truncate text-xs text-gray-700"
                              >
                                {participant?.name ||
                                  participant?.email ||
                                  "Participant"}
                              </div>
                            ))}

                          {participants.length > 2 && (
                            <p className="mt-1 text-[11px] font-semibold text-blue-600">
                              +{participants.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No participants
                      </span>
                    )}
                  </td>

                  {/* ==================================
                        STATUS
                    =================================== */}

                  <td className="px-5 py-4">
                    <MeetingBadge
                      meeting={{
                        status: meeting?.status,
                        meetingType: undefined,
                      }}
                    />
                  </td>

                  {/* ==================================
                        ACTIONS
                    =================================== */}

                  <td className="px-5 py-4">
                    <MeetingActions meeting={meeting} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ==================================================
          MOBILE / TABLET CARDS
      ================================================== */}

      <div className="divide-y divide-gray-100 lg:hidden">
        {meetings.map((meeting) => {
          const meetingId = meeting?._id || meeting?.id;

          const participants = Array.isArray(meeting?.participants)
            ? meeting.participants
            : [];

          return (
            <div key={meetingId} className="p-4">
              {/* ==================================
                    TOP
                =================================== */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-gray-800">
                    {meeting?.title || "Untitled Meeting"}
                  </h3>

                  {meeting?.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {meeting.description}
                    </p>
                  )}
                </div>

                <MeetingActions meeting={meeting} onDelete={onDelete} />
              </div>

              {/* ==================================
                    BADGES
                =================================== */}

              <div className="mt-3">
                <MeetingBadge meeting={meeting} />
              </div>

              {/* ==================================
                    DATE / TIME
                =================================== */}

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <CalendarDays size={15} className="text-blue-500" />

                  <span className="text-xs font-medium text-gray-700">
                    {formatMeetingDate(meeting?.meetingDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <Clock size={15} className="text-gray-400" />

                  <span className="text-xs font-medium text-gray-700">
                    {formatMeetingTime(meeting?.startTime)}

                    {" - "}

                    {formatMeetingTime(meeting?.endTime)}
                  </span>
                </div>
              </div>

              {/* ==================================
                    DURATION
                =================================== */}

              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Duration:
                  <span className="ml-1 font-semibold text-gray-700">
                    {calculateMeetingDuration(
                      meeting?.startTime,
                      meeting?.endTime,
                    )}
                  </span>
                </span>
              </div>

              {/* ==================================
                    PARTICIPANTS
                =================================== */}

              <div className="mt-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <Users size={14} />
                  Participants
                </div>

                {participants.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {participants.slice(0, 3).map((participant, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
                      >
                        {participant?.name ||
                          participant?.email ||
                          "Participant"}
                      </span>
                    ))}

                    {participants.length > 3 && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                        +{participants.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No participants</p>
                )}
              </div>

              {/* ==================================
                    LOCATION / LINK
                =================================== */}

              <div className="mt-3">
                {meeting?.meetingType === "Online" && meeting?.meetingLink && (
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    <Video size={14} />
                    Join Meeting
                    <ExternalLink size={12} />
                  </a>
                )}

                {meeting?.meetingType === "Offline" && meeting?.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={14} />

                    {meeting.location}
                  </div>
                )}

                {meeting?.meetingType === "Phone" && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone size={14} />
                    Phone Meeting
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

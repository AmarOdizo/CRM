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
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

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

  const columnDefs = [
    {
      headerName: "Meeting Info",
      field: "title",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-left">
          <p className="truncate text-xs font-bold text-slate-800">
            {params.data.title || "Untitled Meeting"}
          </p>
          {params.data.description && (
            <p className="mt-0.5 truncate text-[10px] text-slate-400 font-medium">
              {params.data.description}
            </p>
          )}
        </div>
      ),
    },
    {
      headerName: "Date & Timeline",
      field: "meetingDate",
      flex: 2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-[10px]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <CalendarDays size={13} className="text-blue-500 shrink-0" />
            {params.context.formatMeetingDate(params.data.meetingDate)}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 mt-1 font-medium">
            <Clock size={12} className="shrink-0" />
            <span>
              {params.context.formatMeetingTime(params.data.startTime)} - {params.context.formatMeetingTime(params.data.endTime)}
            </span>
          </div>
        </div>
      ),
    },
    {
      headerName: "Type & Connect",
      field: "meetingType",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-[10px] items-start gap-1">
          <MeetingBadge meeting={params.data} />
          {params.data.meetingType === "Online" && params.data.meetingLink && (
            <a
              href={params.data.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-bold text-blue-600 hover:text-blue-800 text-[10px]"
            >
              <span>Join Link</span>
              <ExternalLink size={10} />
            </a>
          )}
          {params.data.meetingType === "Offline" && params.data.location && (
            <div className="flex max-w-[180px] items-center gap-0.5 text-slate-400 font-medium">
              <MapPin size={10} />
              <span className="truncate">{params.data.location}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      headerName: "Participants",
      field: "participants",
      flex: 1.8,
      minWidth: 185,
      cellRenderer: (params) => {
        const list = Array.isArray(params.value) ? params.value : [];
        return (
          <div className="flex items-center gap-1.5 h-full py-1 text-[10px]">
            {list.length > 0 ? (
              <div className="flex max-w-[220px] items-start gap-1.5">
                <Users size={13} className="mt-0.5 shrink-0 text-slate-400" />
                <div className="min-w-0 font-medium">
                  {list.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="truncate text-slate-600 leading-tight">
                      {p?.name || p?.email || "Participant"}
                    </div>
                  ))}
                  {list.length > 2 && (
                    <p className="text-[9px] font-bold text-blue-600 mt-0.5">
                      +{list.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-slate-400">No participants</span>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-end h-full py-1">
          <MeetingActions meeting={params.data} onDelete={params.context.onDelete} />
        </div>
      ),
      width: 100,
      suppressMenu: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block ag-theme-quartz w-full">
        <AgGridReact
          rowData={meetings}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={44}
          context={{
            onDelete,
            formatMeetingDate,
            formatMeetingTime,
            calculateMeetingDuration,
          }}
        />
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

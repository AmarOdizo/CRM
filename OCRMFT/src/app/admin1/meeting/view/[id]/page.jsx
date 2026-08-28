"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  User,
  Users,
  Video,
  AlertCircle,
} from "lucide-react";

import { getMeetingById } from "../../data";

import {
  calculateMeetingDuration,
  formatMeetingDate,
  formatMeetingTime,
} from "../../utils";

import MeetingBadge from "../../meetingcomponents/MeetingBadge";

export default function ViewMeetingPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  // ==================================================
  // STATE
  // ==================================================

  const [meeting, setMeeting] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==================================================
  // FETCH MEETING
  // ==================================================

  const fetchMeeting = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getMeetingById(id);

      let meetingData = null;

      // API:
      // { data: {...} }

      if (response?.data && typeof response.data === "object") {
        meetingData = response.data;
      }

      // API:
      // { meeting: {...} }
      else if (response?.meeting && typeof response.meeting === "object") {
        meetingData = response.meeting;
      }

      // API:
      // {...}
      else {
        meetingData = response;
      }

      if (!meetingData) {
        throw new Error("Meeting not found.");
      }

      setMeeting(meetingData);
    } catch (err) {
      console.error("View Meeting Error:", err);

      setError(err?.message || "Failed to load meeting.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD
  // ==================================================

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Meeting Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Loading meeting information...
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Meeting Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Unable to load meeting
              </p>
            </div>
          </div>

          <Link
            href="/admin1/meeting"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back to Meetings
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-bold text-red-800">Meeting Not Found</h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "The requested meeting could not be found."}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={fetchMeeting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>

                <Link
                  href="/admin1/meeting"
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  <ArrowLeft size={15} />
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // DATA
  // ==================================================

  const meetingId = meeting?._id || meeting?.id || id;

  const participants = Array.isArray(meeting?.participants)
    ? meeting.participants
    : [];

  // ==================================================
  // MAIN
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin1/meeting")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Meeting Details
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Review agenda, timing, and attendee statuses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin1/meeting/edit/${meetingId}`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Edit size={15} />
              <span>Edit Details</span>
            </Link>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER SUMMARY */}
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {meeting?.title || "Untitled Meeting"}
                </h2>
                {meeting?.description && (
                  <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-500 font-medium">
                    {meeting.description}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <MeetingBadge meeting={meeting} />
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 gap-5 p-6 sm:p-8 lg:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              title="Meeting Date"
              value={formatMeetingDate(meeting?.meetingDate)}
            />

            <DetailItem
              icon={Clock}
              title="Meeting Time"
              value={`${formatMeetingTime(
                meeting?.startTime,
              )} - ${formatMeetingTime(meeting?.endTime)}`}
            />

            <DetailItem
              icon={Clock}
              title="Duration"
              value={calculateMeetingDuration(
                meeting?.startTime,
                meeting?.endTime,
              )}
            />

            <DetailItem
              icon={
                meeting?.meetingType === "Online"
                  ? Video
                  : meeting?.meetingType === "Phone"
                    ? Phone
                    : MapPin
              }
              title="Meeting Type"
              value={meeting?.meetingType || "Not specified"}
            />

            {meeting?.meetingType === "Offline" && (
              <DetailItem
                icon={MapPin}
                title="Venue Location"
                value={meeting?.location || "Location not specified"}
              />
            )}

            {meeting?.meetingType === "Online" && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/30 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600">
                  <Video size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Meeting Link
                  </p>
                  {meeting?.meetingLink ? (
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span className="truncate">{meeting.meetingLink}</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-1 text-xs font-medium text-slate-400">No join link provided</p>
                  )}
                </div>
              </div>
            )}

            {meeting?.organizer && (
              <DetailItem
                icon={User}
                title="Organizer"
                value={
                  meeting.organizer?.name ||
                  meeting.organizer?.email ||
                  meeting.organizer
                }
              />
            )}

            {meeting?.clientId && (
              <DetailItem
                icon={User}
                title="Linked Client"
                value={
                  typeof meeting.clientId === "object"
                    ? meeting.clientId.clientName || "Associated Client"
                    : meeting.clientId
                }
              />
            )}

            {meeting?.projectId && (
              <DetailItem
                icon={FileText}
                title="Linked Project"
                value={
                  typeof meeting.projectId === "object"
                    ? meeting.projectId.projectName || "Associated Project"
                    : meeting.projectId
                }
              />
            )}
          </div>

          {/* PARTICIPANTS */}
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attendees</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {participants.length} attendee{participants.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {participants.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {participants.map((participant, index) => (
                  <div
                    key={participant?._id || participant?.id || index}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/20 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700">
                      {(participant?.name || participant?.email || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {participant?.name || "Participant"}
                      </p>
                      {participant?.email && (
                        <p className="truncate text-[10px] text-slate-400 font-medium">
                          {participant.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <Users size={20} className="mx-auto text-slate-300" />
                <p className="mt-1.5 text-xs font-medium text-slate-400">
                  No participants configured for this schedule.
                </p>
              </div>
            )}
          </div>

          {/* NOTES */}
          {meeting?.notes && (
            <div className="border-t border-slate-100 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notes</h3>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-500 font-medium">
                    {meeting.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// DETAIL ITEM COMPONENT
function DetailItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/30 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-250/20 text-blue-600 shadow-sm">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-1 break-words text-xs font-bold text-slate-700">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

"use client";

import { CalendarPlus, RefreshCw, AlertCircle, CalendarRange } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getMeetings } from "./data";
import MeetingSummary from "./meetingcomponents/MeetingSummary";
import SearchFilter from "./meetingcomponents/SearchFilter";
import MeetingTable from "./meetingcomponents/MeetingTable";
import MeetingForm from "./meetingcomponents/MeetingForm";
import { Modal } from "antd";

// ======================================================
// MAIN PAGE
// ======================================================

export default function MeetingSchedulingPage() {
  // ==================================================
  // STATE
  // ==================================================

  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const isEditMode = Boolean(selectedMeeting?._id || selectedMeeting?.id);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    meetingType: "All",
    date: "",
  });

  // ==================================================
  // FETCH MEETINGS
  // ==================================================

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMeetings();

      /*
          Depending on your API response:

          Case 1:
          response = [...]

          Case 2:
          response = {
            data: [...]
          }

          Case 3:
          response = {
            meetings: [...]
          }
        */

      let meetingData = [];

      if (Array.isArray(response)) {
        meetingData = response;
      } else if (Array.isArray(response?.data)) {
        meetingData = response.data;
      } else if (Array.isArray(response?.meetings)) {
        meetingData = response.meetings;
      }

      setMeetings(meetingData);

      setFilteredMeetings(meetingData);
    } catch (err) {
      console.error("Fetch Meetings Error:", err);

      setError(err?.message || "Failed to load meetings.");

      setMeetings([]);
      setFilteredMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // ==================================================
  // APPLY FILTERS
  // ==================================================

  useEffect(() => {
    let result = [...meetings];

    // ----------------------------------------------
    // SEARCH
    // ----------------------------------------------

    const search = filters.search.trim().toLowerCase();

    if (search) {
      result = result.filter((meeting) => {
        const title = String(meeting?.title || "").toLowerCase();

        const description = String(meeting?.description || "").toLowerCase();

        const location = String(meeting?.location || "").toLowerCase();

        const participants = Array.isArray(meeting?.participants)
          ? meeting.participants
          : [];

        const participantText = participants
          .map(
            (participant) =>
              `${participant?.name || ""} ${participant?.email || ""}`,
          )
          .join(" ")
          .toLowerCase();

        return (
          title.includes(search) ||
          description.includes(search) ||
          location.includes(search) ||
          participantText.includes(search)
        );
      });
    }

    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (filters.status !== "All") {
      result = result.filter(
        (meeting) =>
          String(meeting?.status || "").toLowerCase() ===
          filters.status.toLowerCase(),
      );
    }

    // ----------------------------------------------
    // MEETING TYPE
    // ----------------------------------------------

    if (filters.meetingType !== "All") {
      result = result.filter(
        (meeting) =>
          String(meeting?.meetingType || "").toLowerCase() ===
          filters.meetingType.toLowerCase(),
      );
    }

    // ----------------------------------------------
    // DATE
    // ----------------------------------------------

    if (filters.date) {
      result = result.filter((meeting) => {
        const meetingDate = meeting?.meetingDate;

        if (!meetingDate) {
          return false;
        }

        const formattedDate = new Date(meetingDate).toISOString().split("T")[0];

        return formattedDate === filters.date;
      });
    }

    setFilteredMeetings(result);
  }, [meetings, filters]);

  // ==================================================
  // FILTER CHANGE
  // ==================================================

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = (deletedId) => {
    setMeetings((previousMeetings) =>
      previousMeetings.filter(
        (meeting) => (meeting?._id || meeting?.id) !== deletedId,
      ),
    );
  };

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = () => {
    fetchMeetings();
  };

  // ==================================================
  // ERROR STATE
  // ==================================================

  if (error && !meetings.length) {
    return (
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Meeting Scheduling
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and schedule your meetings
            </p>
          </div>

          <Link
            href="/admin1/meeting/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <CalendarPlus size={17} />
            Schedule Meeting
          </Link>
        </div>

        {/* ERROR */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-bold text-red-800">
                Failed to load meetings
              </h2>

              <p className="mt-1 text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={handleRefresh}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Meeting Scheduling</h1>
            <p className="mt-1 text-slate-500 font-medium">Manage, schedule, and track customer meetings and check-ins.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => {
                setSelectedMeeting(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <CalendarPlus size={16} />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <MeetingSummary meetings={meetings} />

        {/* SEARCH / FILTER */}
        <SearchFilter
          totalCount={filteredMeetings.length}
          onFilterChange={handleFilterChange}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={17} className="text-rose-600" />
              <p className="text-sm font-semibold text-rose-850">{error}</p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* MEETING TABLE */}
        <MeetingTable
          meetings={filteredMeetings}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(meeting) => {
            setSelectedMeeting(meeting);
            setModalOpen(true);
          }}
        />

        {/* DIALOG FORM MODAL */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <CalendarRange className="text-blue-500 animate-pulse" size={18} />
              <span className="font-extrabold text-lg">{isEditMode ? "Edit Meeting Details" : "Schedule New Meeting"}</span>
            </div>
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          width={700}
          destroyOnClose
          centered
          className="meeting-form-modal"
          maskStyle={{ backdropFilter: "blur(4px)" }}
        >
          <div className="mt-4 max-h-[80vh] overflow-y-auto px-1">
            <MeetingForm
              meeting={selectedMeeting}
              onSuccess={() => {
                setModalOpen(false);
                fetchMeetings();
              }}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

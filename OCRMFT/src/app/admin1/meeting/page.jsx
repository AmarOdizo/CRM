"use client";

import { CalendarPlus, RefreshCw, AlertCircle } from "lucide-react";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import { getMeetings } from "./data";

import MeetingSummary from "./meetingcomponents/MeetingSummary";
import SearchFilter from "./meetingcomponents/SearchFilter";
import MeetingTable from "./meetingcomponents/MeetingTable";

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
    <div className="space-y-6">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Meeting Scheduling
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, schedule and track your meetings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* REFRESH */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* ADD */}

          <Link
            href="/admin1/meeting/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <CalendarPlus size={17} />
            Schedule Meeting
          </Link>
        </div>
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <MeetingSummary meetings={meetings} />

      {/* ==================================================
          SEARCH / FILTER
      ================================================== */}

      <SearchFilter
        totalCount={filteredMeetings.length}
        onFilterChange={handleFilterChange}
      />

      {/* ==================================================
          BACKEND ERROR
          When old data exists but refresh failed
      ================================================== */}

      {error && meetings.length > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={17} className="text-yellow-600" />

            <p className="text-sm text-yellow-800">{error}</p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="text-xs font-bold text-yellow-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ==================================================
          TABLE
      ================================================== */}

      <MeetingTable
        meetings={filteredMeetings}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}

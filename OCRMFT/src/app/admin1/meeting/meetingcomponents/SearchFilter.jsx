"use client";

import { CalendarDays, Filter, Search, X } from "lucide-react";

import { useState } from "react";

// ======================================================
// SEARCH FILTER
// ======================================================

export default function SearchFilter({ onFilterChange, totalCount = 0 }) {
  // ==================================================
  // STATE
  // ==================================================

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [meetingType, setMeetingType] = useState("All");

  const [date, setDate] = useState("");

  // ==================================================
  // SEND FILTERS
  // ==================================================

  const updateFilters = (newFilters) => {
    const filters = {
      search,
      status,
      meetingType,
      date,
      ...newFilters,
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // ==================================================
  // SEARCH CHANGE
  // ==================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    updateFilters({
      search: value,
    });
  };

  // ==================================================
  // STATUS CHANGE
  // ==================================================

  const handleStatusChange = (e) => {
    const value = e.target.value;

    setStatus(value);

    updateFilters({
      status: value,
    });
  };

  // ==================================================
  // TYPE CHANGE
  // ==================================================

  const handleTypeChange = (e) => {
    const value = e.target.value;

    setMeetingType(value);

    updateFilters({
      meetingType: value,
    });
  };

  // ==================================================
  // DATE CHANGE
  // ==================================================

  const handleDateChange = (e) => {
    const value = e.target.value;

    setDate(value);

    updateFilters({
      date: value,
    });
  };

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setMeetingType("All");
    setDate("");

    const filters = {
      search: "",
      status: "All",
      meetingType: "All",
      date: "",
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // ==================================================
  // ACTIVE FILTER COUNT
  // ==================================================

  const activeFilterCount = [
    search,
    status !== "All" ? status : "",
    meetingType !== "All" ? meetingType : "",
    date,
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* ==================================================
          TOP
      ================================================== */}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Filter size={18} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Search & Filters
            </h3>

            <p className="text-xs text-gray-500">{totalCount} meetings found</p>
          </div>
        </div>

        {/* ACTIVE FILTER */}

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {activeFilterCount} active
            </span>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <X size={14} />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search meetings..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* ==================================================
            STATUS
        ================================================== */}

        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Status</option>

          <option value="Scheduled">Scheduled</option>

          <option value="Completed">Completed</option>

          <option value="Cancelled">Cancelled</option>

          <option value="Rescheduled">Rescheduled</option>
        </select>

        {/* ==================================================
            MEETING TYPE
        ================================================== */}

        <select
          value={meetingType}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Meeting Types</option>

          <option value="Online">Online</option>

          <option value="Offline">Offline</option>

          <option value="Phone">Phone</option>
        </select>

        {/* ==================================================
            DATE
        ================================================== */}

        <div className="relative">
          <CalendarDays
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}

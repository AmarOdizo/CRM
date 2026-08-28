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
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* SEARCH */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Search Meetings
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search title, desc..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Status
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* MEETING TYPE */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Type
          </label>
          <div className="relative">
            <select
              value={meetingType}
              onChange={handleTypeChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              <option value="All">All Meeting Types</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Phone">Phone</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* DATE */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Date
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <CalendarDays size={16} />
            </span>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="rounded-lg bg-blue-50 border border-blue-100/55 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {activeFilterCount} active filters
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

// ============================================================
// COMPONENT
// ============================================================

export default function SearchFilter({
  onFilterChange,
  onReset,
  totalResults = 0,
}) {
  // ==========================================================
  // STATES
  // ==========================================================

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [dateFrom, setDateFrom] = useState("");

  const [dateTo, setDateTo] = useState("");

  // ==========================================================
  // APPLY FILTER
  // ==========================================================

  const applyFilter = (updatedValues = {}) => {
    const filters = {
      search: updatedValues.search ?? search,

      status: updatedValues.status ?? status,

      dateFrom: updatedValues.dateFrom ?? dateFrom,

      dateTo: updatedValues.dateTo ?? dateTo,
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // ==========================================================
  // SEARCH CHANGE
  // ==========================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    applyFilter({
      search: value,
    });
  };

  // ==========================================================
  // STATUS CHANGE
  // ==========================================================

  const handleStatusChange = (e) => {
    const value = e.target.value;

    setStatus(value);

    applyFilter({
      status: value,
    });
  };

  // ==========================================================
  // DATE FROM
  // ==========================================================

  const handleDateFromChange = (e) => {
    const value = e.target.value;

    setDateFrom(value);

    applyFilter({
      dateFrom: value,
    });
  };

  // ==========================================================
  // DATE TO
  // ==========================================================

  const handleDateToChange = (e) => {
    const value = e.target.value;

    setDateTo(value);

    applyFilter({
      dateTo: value,
    });
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setDateFrom("");
    setDateTo("");

    if (onReset) {
      onReset();
    }

    if (onFilterChange) {
      onFilterChange({
        search: "",
        status: "All",
        dateFrom: "",
        dateTo: "",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* SEARCH */}
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Search
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search number, customer name..."
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
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
              <option value="Converted">Converted</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* DATE FROM */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Date From
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {search && (
            <span className="rounded-lg bg-blue-50 border border-blue-100/55 px-2.5 py-1 text-xs font-semibold text-blue-700">
              Search: {search}
            </span>
          )}
          {status !== "All" && (
            <span className="rounded-lg bg-purple-50 border border-purple-100/55 px-2.5 py-1 text-xs font-semibold text-purple-700">
              Status: {status}
            </span>
          )}
          {dateFrom && (
            <span className="rounded-lg bg-emerald-50 border border-emerald-100/55 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              From: {dateFrom}
            </span>
          )}
          {dateTo && (
            <span className="rounded-lg bg-orange-50 border border-orange-100/55 px-2.5 py-1 text-xs font-semibold text-orange-700">
              To: {dateTo}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

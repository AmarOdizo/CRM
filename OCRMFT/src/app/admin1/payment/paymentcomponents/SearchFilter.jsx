"use client";

import { useState } from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

const STATUS_OPTIONS = [
  "All",
  "Paid",
  "Partial",
  "Pending",
  "Overdue",
  "Cancelled",
];

const PAYMENT_METHOD_OPTIONS = [
  "All",
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Card",
  "Other",
];

export default function SearchFilter({ onFilterChange, totalResults = 0 }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    paymentMethod: "All",
    date: "",
  });

  // ==========================================
  // HANDLE FILTER CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const handleReset = () => {
    const resetFilters = {
      search: "",
      status: "All",
      paymentMethod: "All",
      date: "",
    };

    setFilters(resetFilters);

    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const activeFilterCount = [
    filters.search,
    filters.status !== "All" ? filters.status : "",
    filters.paymentMethod !== "All" ? filters.paymentMethod : "",
    filters.date,
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* SEARCH */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Search Payments
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search invoice number, ref..."
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
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Status" : status}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Payment Method
          </label>
          <div className="relative">
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              {PAYMENT_METHOD_OPTIONS.map((method) => (
                <option key={method} value={method}>
                  {method === "All" ? "All Methods" : method}
                </option>
              ))}
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
            Payment Date
          </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </form>

      {/* RESULTS COUNT & RESET BUTTON */}
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {totalResults} transaction{totalResults !== 1 ? "s" : ""} found
        </span>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}

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

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <SlidersHorizontal size={18} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800">Search & Filter</h3>

            <p className="text-xs text-gray-500">Find payments quickly</p>
          </div>
        </div>

        <span className="text-xs font-medium text-gray-500">
          {totalResults} result
          {totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {/* =====================================
          FILTER FORM
      ====================================== */}

      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5"
      >
        {/* =================================
            SEARCH
        ================================== */}

        <div className="relative lg:col-span-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search invoice, transaction..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* =================================
            STATUS
        ================================== */}

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Status" : status}
            </option>
          ))}
        </select>

        {/* =================================
            PAYMENT METHOD
        ================================== */}

        <select
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {PAYMENT_METHOD_OPTIONS.map((method) => (
            <option key={method} value={method}>
              {method === "All" ? "All Methods" : method}
            </option>
          ))}
        </select>

        {/* =================================
            DATE
        ================================== */}

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {/* =================================
            RESET
        ================================== */}

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </form>
    </div>
  );
}

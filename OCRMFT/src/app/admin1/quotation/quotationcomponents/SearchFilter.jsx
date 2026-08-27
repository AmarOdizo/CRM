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
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
      "
    >
      {/* ======================================================
          FILTER HEADER
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h3
            className="
              text-base
              font-semibold
              text-gray-800
            "
          >
            Search & Filter
          </h3>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
            "
          >
            Find quotations quickly.
          </p>
        </div>

        <div
          className="
            text-xs
            text-gray-500
          "
        >
          {totalResults} {totalResults === 1 ? "quotation" : "quotations"}
        </div>
      </div>

      {/* ======================================================
          FILTER GRID
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* ====================================================
            SEARCH
        ==================================================== */}

        <div
          className="
            lg:col-span-2
          "
        >
          <label
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-gray-600
            "
          >
            Search
          </label>

          <div className="relative">
            <span
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            >
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="
                Search quotation number,
                customer or company...
              "
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* ====================================================
            STATUS
        ==================================================== */}

        <div>
          <label
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-gray-600
            "
          >
            Status
          </label>

          <select
            value={status}
            onChange={handleStatusChange}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="All">All Status</option>

            <option value="Draft">Draft</option>

            <option value="Sent">Sent</option>

            <option value="Accepted">Accepted</option>

            <option value="Rejected">Rejected</option>

            <option value="Expired">Expired</option>

            <option value="Converted">Converted</option>
          </select>
        </div>

        {/* ====================================================
            DATE FROM
        ==================================================== */}

        <div>
          <label
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-gray-600
            "
          >
            Date From
          </label>

          <input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        {/* ====================================================
            DATE TO
        ==================================================== */}

        <div>
          <label
            className="
              mb-1.5
              block
              text-xs
              font-semibold
              text-gray-600
            "
          >
            Date To
          </label>

          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={handleDateToChange}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>
      </div>

      {/* ======================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3
          border-t
          border-gray-100
          pt-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Active Filters */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          {search && (
            <span
              className="
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-medium
                text-blue-700
              "
            >
              Search: {search}
            </span>
          )}

          {status !== "All" && (
            <span
              className="
                rounded-full
                bg-purple-50
                px-3
                py-1
                text-xs
                font-medium
                text-purple-700
              "
            >
              Status: {status}
            </span>
          )}

          {dateFrom && (
            <span
              className="
                rounded-full
                bg-green-50
                px-3
                py-1
                text-xs
                font-medium
                text-green-700
              "
            >
              From: {dateFrom}
            </span>
          )}

          {dateTo && (
            <span
              className="
                rounded-full
                bg-orange-50
                px-3
                py-1
                text-xs
                font-medium
                text-orange-700
              "
            >
              To: {dateTo}
            </span>
          )}
        </div>

        {/* Reset */}

        <button
          type="button"
          onClick={handleReset}
          className="
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
          "
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

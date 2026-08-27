"use client";

import { Search, X } from "lucide-react";

export default function SearchFilter({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
}) {
  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setPriority("All");
  };

  const hasFilters =
    search.trim() !== "" || status !== "All" || priority !== "All";

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search task..."
            className="h-11 w-full rounded-lg border border-gray-300
                       bg-white pl-10 pr-4 text-sm text-gray-700
                       outline-none transition
                       focus:border-blue-500 focus:ring-2
                       focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-300
                     bg-white px-3 text-sm text-gray-700
                     outline-none transition
                     focus:border-blue-500 focus:ring-2
                     focus:ring-blue-100"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-300
                     bg-white px-3 text-sm text-gray-700
                     outline-none transition
                     focus:border-blue-500 focus:ring-2
                     focus:ring-blue-100"
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg
                       px-3 py-2 text-sm font-medium
                       text-gray-600 transition
                       hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

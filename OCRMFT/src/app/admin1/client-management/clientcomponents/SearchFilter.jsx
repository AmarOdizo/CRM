"use client";

export default function SearchFilter({ search, setSearch, status, setStatus }) {
  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Search */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search Client
          </label>

          <input
            type="text"
            placeholder="Search by Client, Company, Email or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Filter */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Filter by Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

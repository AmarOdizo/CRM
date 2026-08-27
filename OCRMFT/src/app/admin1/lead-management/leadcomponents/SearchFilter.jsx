"use client";

export default function SearchFilter({ search, setSearch, status, setStatus }) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Search */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search Lead
          </label>

          <input
            type="text"
            placeholder="Search by Client, Company, Email or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Filter by Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>
    </div>
  );
}

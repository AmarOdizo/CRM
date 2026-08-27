"use client";

export default function SearchFilter({ search, setSearch }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Search Report
      </label>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Report Name, Type or Created By..."
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

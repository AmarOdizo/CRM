"use client";

export default function ReportFilter({ reportType, setReportType }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <label className="mb-3 block text-sm font-semibold text-gray-700">
        Report Type
      </label>

      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        <option value="All">All Reports</option>
        <option value="Lead Report">Lead Report</option>
        <option value="Client Report">Client Report</option>
        <option value="Employee Report">Employee Report</option>
        <option value="Project Report">Project Report</option>
        <option value="Revenue Report">Revenue Report</option>
        <option value="Task Report">Task Report</option>
      </select>
    </div>
  );
}

"use client";

import { exportToCSV } from "../utils";

export default function ExportCSV({ projects }) {
  return (
    <button
      onClick={() => exportToCSV(projects)}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl"
    >
      Export CSV
    </button>
  );
}

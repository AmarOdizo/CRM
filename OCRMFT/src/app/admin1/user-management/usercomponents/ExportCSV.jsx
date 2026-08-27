"use client";

import { exportToCSV } from "../utils";

export default function ExportCSV({ users }) {
  return (
    <button
      onClick={() => exportToCSV(users)}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
    >
      Export CSV
    </button>
  );
}

"use client";

import { exportLeadsToCSV } from "../utils";

export default function ExportCSV({ leads }) {
  return (
    <button
      onClick={() => exportLeadsToCSV(leads)}
      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
    >
      Export CSV
    </button>
  );
}

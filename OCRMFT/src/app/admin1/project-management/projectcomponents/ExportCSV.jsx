"use client";

import { Download } from "lucide-react";
import { exportToCSV } from "../utils";

export default function ExportCSV({ projects }) {
  return (
    <button
      onClick={() => exportToCSV(projects)}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer"
    >
      <Download size={18} className="text-slate-400" />
      <span>Export CSV</span>
    </button>
  );
}

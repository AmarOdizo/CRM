"use client";

import { Download } from "lucide-react";

export default function ExportCSV({ tasks = [], fileName = "tasks.csv" }) {
  const exportCSV = () => {
    if (!tasks || tasks.length === 0) {
      alert("No tasks available to export.");
      return;
    }

    const headers = [
      "ID",
      "Title",
      "Description",
      "Assigned To",
      "Status",
      "Priority",
      "Due Date",
      "Created At",
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) {
        return "";
      }

      const stringValue = String(value);

      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const rows = tasks.map((task) => [
      task.id,
      task.title,
      task.description,
      task.assignedTo,
      task.status,
      task.priority,
      task.dueDate,
      task.createdAt,
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportCSV}
      disabled={!tasks || tasks.length === 0}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
    >
      <Download size={18} className="text-slate-400" />
      <span>Export CSV</span>
    </button>
  );
}

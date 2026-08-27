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
      className="flex items-center gap-2 rounded-lg
                 bg-emerald-600 px-4 py-2.5
                 text-sm font-medium text-white
                 transition hover:bg-emerald-700
                 disabled:cursor-not-allowed
                 disabled:bg-gray-300
                 disabled:text-gray-500"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}

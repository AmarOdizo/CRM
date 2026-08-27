"use client";

import { exportCSV } from "../data";

export default function ExportCSV() {
  const handleExport = async () => {
    try {
      const blob = await exportCSV();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Report.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("CSV Export Failed");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
    >
      Export CSV
    </button>
  );
}

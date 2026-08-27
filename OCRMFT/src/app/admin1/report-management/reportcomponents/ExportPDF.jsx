"use client";

import { exportPDF } from "../data";

export default function ExportPDF() {
  const handleExport = async () => {
    try {
      const blob = await exportPDF();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Report.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("PDF Export Failed");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
    >
      Export PDF
    </button>
  );
}

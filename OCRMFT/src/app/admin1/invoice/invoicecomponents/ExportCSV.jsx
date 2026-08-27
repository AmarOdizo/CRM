"use client";

import { Download } from "lucide-react";

export default function ExportCSV({
  invoices = [],
  filename = "invoices.csv",
}) {
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  const exportCSV = () => {
    if (!invoices || invoices.length === 0) {
      alert("No invoice data available to export.");
      return;
    }

    const headers = [
      "Invoice Number",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Invoice Date",
      "Due Date",
      "Subtotal",
      "Tax",
      "Discount",
      "Total Amount",
      "Payment Status",
      "Invoice Status",
    ];

    const rows = invoices.map((invoice) => [
      invoice.invoiceNumber || invoice.invoiceNo || invoice.invoiceId || "",

      invoice.customerName || "",

      invoice.customerEmail || "",

      invoice.customerPhone || "",

      formatDate(invoice.invoiceDate),

      formatDate(invoice.dueDate),

      Number(invoice.subtotal || 0).toFixed(2),

      Number(invoice.tax || 0),

      Number(invoice.discount || 0),

      Number(
        invoice.totalAmount || invoice.grandTotal || invoice.total || 0,
      ).toFixed(2),

      invoice.paymentStatus || "",

      invoice.status || "",
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportCSV}
      disabled={!invoices || invoices.length === 0}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={17} />
      Export CSV
    </button>
  );
}

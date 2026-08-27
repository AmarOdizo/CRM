"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function InvoiceActions({ invoice, onDelete }) {
  if (!invoice) return null;

  const invoiceId = invoice._id || invoice.id;

  return (
    <div className="flex items-center gap-2">
      {/* View */}
      <Link
        href={`/admin1/invoice/view/${invoiceId}`}
        title="View Invoice"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
      >
        <Eye size={17} />
      </Link>

      {/* Edit */}
      <Link
        href={`/admin1/invoice/edit/${invoiceId}`}
        title="Edit Invoice"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 transition hover:bg-yellow-100"
      >
        <Pencil size={17} />
      </Link>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete?.(invoice)}
        title="Delete Invoice"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

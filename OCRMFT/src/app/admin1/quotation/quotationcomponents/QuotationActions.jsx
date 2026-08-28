"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteQuotation, updateQuotationStatus } from "../data";

export default function QuotationActions({
  quotation,
  onDelete,
  onStatusChange,
  showView = true,
  showEdit = true,
  showDelete = true,
  showStatus = false,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quotationId = quotation?._id || quotation?.id;

  const handleView = () => {
    if (!quotationId) return;
    router.push(`/admin1/quotation/view/${quotationId}`);
  };

  const handleEdit = () => {
    if (!quotationId) return;
    router.push(`/admin1/quotation/edit/${quotationId}`);
  };

  const handleDelete = async () => {
    if (!quotationId) {
      setError("Quotation ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete quotation ${
        quotation?.quotationNumber || ""
      }?`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      await deleteQuotation(quotationId);
      if (onDelete) {
        onDelete(quotationId);
      }
    } catch (err) {
      console.error("Delete Quotation Error:", err);
      setError(err.message || "Failed to delete quotation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {showView && (
        <button
          type="button"
          onClick={handleView}
          disabled={loading}
          title="View Details"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition active:scale-90 cursor-pointer"
        >
          <Eye size={16} />
        </button>
      )}

      {showEdit && (
        <button
          type="button"
          onClick={handleEdit}
          disabled={loading}
          title="Edit Item"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition active:scale-90 cursor-pointer"
        >
          <Pencil size={15} />
        </button>
      )}

      {showDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          title="Delete Item"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 transition active:scale-90 cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      )}

      {error && (
        <span className="text-[10px] text-rose-600 font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  );
}

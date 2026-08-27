"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteQuotation, updateQuotationStatus } from "../data";

// ============================================================
// COMPONENT
// ============================================================

export default function QuotationActions({
  quotation,
  onDelete,
  onStatusChange,
  showView = true,
  showEdit = true,
  showDelete = true,
  showStatus = true,
}) {
  const router = useRouter();

  // ==========================================================
  // STATES
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================================
  // QUOTATION ID
  // ==========================================================

  const quotationId = quotation?._id || quotation?.id;

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = () => {
    if (!quotationId) {
      return;
    }

    router.push(`/admin1/quotation/view/${quotationId}`);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = () => {
    if (!quotationId) {
      return;
    }

    router.push(`/admin1/quotation/edit/${quotationId}`);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

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

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteQuotation(quotationId);

      // Parent refresh callback
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

  // ==========================================================
  // STATUS UPDATE
  // ==========================================================

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (!quotationId) {
      setError("Quotation ID not found.");

      return;
    }

    if (newStatus === quotation?.status) {
      return;
    }

    try {
      setStatusLoading(true);
      setError("");

      const result = await updateQuotationStatus(quotationId, newStatus);

      // Parent update callback
      if (onStatusChange) {
        onStatusChange(
          result?.data || {
            ...quotation,
            status: newStatus,
          },
        );
      }
    } catch (err) {
      console.error("Status Update Error:", err);

      setError(err.message || "Failed to update quotation status.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* ======================================================
          ACTION BUTTONS
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-end
          gap-2
        "
      >
        {/* ====================================================
            VIEW
        ==================================================== */}

        {showView && (
          <button
            type="button"
            onClick={handleView}
            disabled={loading}
            title="View quotation"
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            View
          </button>
        )}

        {/* ====================================================
            EDIT
        ==================================================== */}

        {showEdit && (
          <button
            type="button"
            onClick={handleEdit}
            disabled={loading}
            title="Edit quotation"
            className="
              rounded-lg
              border
              border-blue-200
              bg-blue-50
              px-3
              py-2
              text-sm
              font-medium
              text-blue-700
              transition
              hover:bg-blue-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Edit
          </button>
        )}

        {/* ====================================================
            DELETE
        ==================================================== */}

        {showDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || statusLoading}
            title="Delete quotation"
            className="
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-3
              py-2
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      {showStatus && (
        <div
          className="
            flex
            items-center
            justify-end
            gap-2
          "
        >
          <label
            htmlFor={`quotation-status-${quotationId}`}
            className="
              text-xs
              font-medium
              text-gray-500
            "
          >
            Status
          </label>

          <select
            id={`quotation-status-${quotationId}`}
            value={quotation?.status || "Draft"}
            onChange={handleStatusChange}
            disabled={loading || statusLoading}
            className="
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2
              text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-gray-100
            "
          >
            <option value="Draft">Draft</option>

            <option value="Sent">Sent</option>

            <option value="Accepted">Accepted</option>

            <option value="Rejected">Rejected</option>

            <option value="Expired">Expired</option>

            <option value="Converted">Converted</option>
          </select>

          {statusLoading && (
            <span
              className="
                text-xs
                text-gray-500
              "
            >
              Updating...
            </span>
          )}
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <p
          className="
            text-right
            text-xs
            text-red-600
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

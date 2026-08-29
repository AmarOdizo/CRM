"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, FileText, AlertCircle } from "lucide-react";

import QuotationSummary from "./quotationcomponents/QuotationSummary";
import SearchFilter from "./quotationcomponents/SearchFilter";
import QuotationTable from "./quotationcomponents/QuotationTable";
import DeleteModal from "./quotationcomponents/DeleteModal";

const API_URL = "http://localhost:5000/api/Quotation";

export default function QuotationPage() {
  const router = useRouter();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Search / Filter State
   */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  /*
   * ================================
   * FETCH ALL QUOTATIONS
   * ================================
   */
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quotations");
      }

      const result = await response.json();

      /*
       * Supports:
       * 1. Direct array response
       * 2. { data: [] }
       * 3. { quotations: [] }
       */
      const quotationData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.quotations)
            ? result.quotations
            : [];

      setQuotations(quotationData);
    } catch (err) {
      console.error("Fetch quotation error:", err);

      setError(err?.message || "Unable to load quotations. Please try again.");

      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Initial API Call
   */
  useEffect(() => {
    fetchQuotations();
  }, []);

  /*
   * ================================
   * SEARCH + STATUS FILTER
   * ================================
   */
  const filteredQuotations = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return quotations.filter((quotation) => {
      const quotationNumber = String(
        quotation?.quotationNumber ||
        quotation?.quotationNo ||
        quotation?.quoteNumber ||
        quotation?.number ||
        "",
      ).toLowerCase();

      const customerName = String(
        quotation?.customerName ||
        quotation?.customer?.name ||
        quotation?.customer?.customerName ||
        quotation?.customer?.companyName ||
        "",
      ).toLowerCase();

      const customerEmail = String(
        quotation?.customerEmail ||
        quotation?.customer?.email ||
        quotation?.email ||
        "",
      ).toLowerCase();

      const quotationStatus = String(
        quotation?.status || "draft",
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        quotationNumber.includes(searchText) ||
        customerName.includes(searchText) ||
        customerEmail.includes(searchText);

      const matchesStatus =
        status === "all" || quotationStatus === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, status]);

  /*
   * ================================
   * ADD QUOTATION
   * ================================
   */
  const handleAdd = () => {
    router.push("/admin1/quotation/add");
  };

  /*
   * ================================
   * VIEW QUOTATION
   * ================================
   */
  const handleView = (quotation) => {
    const id = quotation?._id || quotation?.id;

    if (!id) return;

    router.push(`/admin1/quotation/view/${id}`);
  };

  /*
   * ================================
   * EDIT QUOTATION
   * ================================
   */
  const handleEdit = (quotation) => {
    const id = quotation?._id || quotation?.id;

    if (!id) return;

    router.push(`/admin1/quotation/edit/${id}`);
  };

  /*
   * ================================
   * OPEN DELETE MODAL
   * ================================
   */
  const handleDelete = (quotation) => {
    setSelectedQuotation(quotation);
    setDeleteModalOpen(true);
  };

  /*
   * ================================
   * CONFIRM DELETE
   * ================================
   */
  const handleConfirmDelete = async () => {
    if (!selectedQuotation) return;

    const id = selectedQuotation?._id || selectedQuotation?.id;

    if (!id) {
      setError("Quotation ID not found.");
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete quotation");
      }

      /*
       * Remove deleted quotation
       * immediately from UI
       */
      setQuotations((prev) =>
        prev.filter(
          (quotation) => String(quotation?._id || quotation?.id) !== String(id),
        ),
      );

      setDeleteModalOpen(false);
      setSelectedQuotation(null);
    } catch (err) {
      console.error("Delete quotation error:", err);

      setError(err?.message || "Unable to delete quotation.");
    } finally {
      setDeleteLoading(false);
    }
  };

  /*
   * ================================
   * RESET SEARCH / FILTER
   * ================================
   */
  const handleReset = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quotations</h1>
            <p className="mt-1 text-slate-500 font-medium">Manage and generate customer project estimate proposals.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchQuotations}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Quotation</span>
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-800">{error}</p>
              <button
                type="button"
                onClick={fetchQuotations}
                className="mt-1.5 text-xs font-bold text-rose-700 underline hover:text-rose-950"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        <QuotationSummary quotations={quotations} />

        {/* SEARCH + FILTER */}
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          onReset={handleReset}
        />

        {/* RESULT INFO */}
        {!loading && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {filteredQuotations.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {quotations.length}
              </span>{" "}
              Quotations
            </p>

            {(search || status !== "all") && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* QUOTATION TABLE */}
        <QuotationTable
          quotations={filteredQuotations}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* DELETE CONFIRM MODAL */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            if (!deleteLoading) {
              setDeleteModalOpen(false);
              setSelectedQuotation(null);
            }
          }}
          onConfirm={handleConfirmDelete}
          quotation={selectedQuotation}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";

import QuotationForm from "../quotationcomponents/QuotationForm";

const API_URL = "http://localhost:5000/api/Quotation";

export default function AddQuotationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * ==========================================
   * CREATE QUOTATION
   * ==========================================
   */
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to create quotation",
        );
      }

      /*
       * After successful creation
       * go back to quotation list
       */
      router.push("/admin1/quotation");
    } catch (err) {
      console.error("Create quotation error:", err);

      setError(err?.message || "Unable to create quotation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ==========================================
   * CANCEL
   * ==========================================
   */
  const handleCancel = () => {
    if (loading) return;

    router.push("/admin1/quotation");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin1/quotation")}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Back to list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create Quotation</h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Estimation Proposal Setup</p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {/* FORM CONTAINER */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Quotation Statement</h2>
            <p className="mt-1 text-xs font-medium text-slate-400">Specify details to compile the customer estimate.</p>
          </div>

          <div className="p-6">
            <QuotationForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>

        {/* LOADING SUBMIT */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>Compiling Quotation...</span>
          </div>
        )}
      </div>
    </div>
  );
}

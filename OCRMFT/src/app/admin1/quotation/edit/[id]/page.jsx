"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react";

import QuotationForm from "../../quotationcomponents/QuotationForm";

const API_URL = "http://localhost:5000/api/Quotation";

export default function EditQuotationPage() {
  const router = useRouter();
  const params = useParams();

  const quotationId = params?.id;

  const [quotation, setQuotation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  /*
   * ==========================================
   * FETCH SINGLE QUOTATION
   * ==========================================
   */
  useEffect(() => {
    if (!quotationId) return;

    const fetchQuotation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${quotationId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.message || result?.error || "Failed to fetch quotation",
          );
        }

        /*
         * Supports:
         * { data: {...} }
         * { quotation: {...} }
         * direct object
         */
        const quotationData = result?.data || result?.quotation || result;

        setQuotation(quotationData);
      } catch (err) {
        console.error("Fetch quotation error:", err);

        setError(err?.message || "Unable to load quotation.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [quotationId]);

  /*
   * ==========================================
   * UPDATE QUOTATION
   * ==========================================
   */
  const handleSubmit = async (formData) => {
    if (!quotationId) {
      setError("Quotation ID not found.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/${quotationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to update quotation",
        );
      }

      /*
       * Update successful
       */
      router.push(`/admin1/quotation/view/${quotationId}`);
    } catch (err) {
      console.error("Update quotation error:", err);

      setError(err?.message || "Unable to update quotation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================
   * CANCEL
   * ==========================================
   */
  const handleCancel = () => {
    if (saving) return;

    router.push(`/admin1/quotation/view/${quotationId}`);
  };

  /*
   * ==========================================
   * BACK
   * ==========================================
   */
  const handleBack = () => {
    if (saving) return;

    router.push("/admin1/quotation");
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Quotation...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve quotation parameters.</p>
        </div>
      </div>
    );
  }

  if (error && !quotation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-2xl font-black text-rose-600">Quotation Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">
            {error || "The requested proposal parameters could not be found."}
          </p>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Quotations</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Quotation</h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Modify Proposal Estimates</p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && quotation && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
        )}

        {/* FORM CONTAINER */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-6 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Quotation Statement</h2>
            <p className="mt-1 text-xs font-medium text-slate-400">Update estimate specifications or line item rates.</p>
          </div>

          <div className="p-6">
            <QuotationForm
              initialData={quotation}
              quotation={quotation}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
              isEdit={true}
            />
          </div>
        </div>

        {/* LOADING SUBMIT */}
        {saving && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>Updating Proposal...</span>
          </div>
        )}
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Loading Quotation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Please wait while quotation details are loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR / NOT FOUND
   * ==========================================
   */
  if (error && !quotation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Unable to Load Quotation
            </h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quotations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* =====================================
            HEADER
        ===================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Back to quotations"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-orange-100 sm:flex">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Quotation
                </h1>

                <p className="text-sm text-gray-500">
                  Update quotation details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}
        {error && quotation && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* =====================================
            FORM
        ===================================== */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Quotation Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Modify the quotation information below.
            </p>
          </div>

          <div className="p-5 sm:p-6">
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

        {/* =====================================
            SAVING
        ===================================== */}
        {saving && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating quotation...
          </div>
        )}
      </div>
    </div>
  );
}

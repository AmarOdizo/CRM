"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

import PaymentForm from "../paymentcomponents/PaymentForm";
import { getPaymentById } from "../data";

function AddPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("id");

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(Boolean(paymentId));

  const [error, setError] = useState("");

  // ==========================================
  // CHECK EDIT MODE
  // ==========================================

  const isEditMode = Boolean(paymentId);

  // ==========================================
  // LOAD PAYMENT FOR EDIT
  // ==========================================

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPaymentById(paymentId);

        /*
         * Supports:
         *
         * {
         *   ...
         * }
         *
         * OR
         *
         * {
         *   data: {...}
         * }
         */

        const paymentData = response?.data || response?.payment || response;

        setPayment(paymentData);
      } catch (err) {
        console.error("Load Payment Error:", err);

        setError(err.message || "Failed to load payment.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  // ==========================================
  // FORM SUCCESS
  // ==========================================

  const handleSuccess = () => {
    router.push("/admin1/payment");

    router.refresh();
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    router.push("/admin1/payment");
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    router.push("/admin1/payment");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto flex min-h-[500px] w-full max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={35} className="animate-spin text-blue-600" />

            <p className="text-sm text-gray-500">Loading payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-bold text-red-700">
              Unable to Load Payment
            </h2>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* ====================================
            PAGE HEADER
        ===================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <CreditCard size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Payment" : "Add Payment"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {isEditMode
                  ? "Update the payment information."
                  : "Record a new payment against an invoice."}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            PAYMENT FORM
        ===================================== */}

        <PaymentForm
          payment={payment}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default function AddPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          <div className="mx-auto flex min-h-[500px] w-full max-w-4xl items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={35} className="animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">Loading payment page...</p>
            </div>
          </div>
        </div>
      }
    >
      <AddPaymentContent />
    </Suspense>
  );
}

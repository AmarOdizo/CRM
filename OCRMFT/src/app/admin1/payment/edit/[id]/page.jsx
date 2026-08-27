"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

import PaymentForm from "../../paymentcomponents/PaymentForm";
import { getPaymentById } from "../../data";

export default function EditPaymentPage() {
  const router = useRouter();
  const params = useParams();

  const paymentId = params?.id;

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // GET PAYMENT
  // ==========================================

  useEffect(() => {
    if (!paymentId) {
      return;
    }

    const loadPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPaymentById(paymentId);

        const paymentData = response?.data || response?.payment || response;

        setPayment(paymentData);
      } catch (err) {
        console.error("Get Payment Error:", err);

        setError(err.message || "Failed to load payment.");
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  // ==========================================
  // SUCCESS
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
        <div className="mx-auto flex min-h-[500px] max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="animate-spin text-blue-600" />

            <p className="text-sm text-gray-500">Loading payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !payment) {
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
              Payment Not Found
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error || "The requested payment does not exist."}
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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
            HEADER
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Payment</h1>

              <p className="mt-1 text-sm text-gray-500">
                Update payment information
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

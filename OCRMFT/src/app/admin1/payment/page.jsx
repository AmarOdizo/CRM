"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Plus, RefreshCw } from "lucide-react";

import { getPayments } from "./data";

import PaymentSummary from "./paymentcomponents/PaymentSummary";
import SearchFilter from "./paymentcomponents/SearchFilter";
import PaymentTable from "./paymentcomponents/PaymentTable";
import DeleteModal from "./paymentcomponents/DeleteModal";

import { calculatePaidAmount, toNumber } from "./utils";

export default function PaymentTrackingPage() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    paymentMethod: "All",
    date: "",
  });

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // ==========================================
  // LOAD PAYMENTS
  // ==========================================

  const getPaymentsData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayments();

      /*
       * Supports:
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR:
       *
       * {
       *   data: [...]
       * }
       *
       * OR:
       *
       * {
       *   payments: [...]
       * }
       */

      let paymentList = [];

      if (Array.isArray(response)) {
        paymentList = response;
      } else if (Array.isArray(response?.data)) {
        paymentList = response.data;
      } else if (Array.isArray(response?.payments)) {
        paymentList = response.payments;
      }

      setPayments(paymentList);
    } catch (err) {
      console.error("Get Payments Error:", err);

      setError(err.message || "Failed to load payments.");

      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    getPaymentsData();
  }, []);

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // ==========================================
  // FILTER PAYMENTS
  // ==========================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // --------------------------------------
      // SEARCH
      // --------------------------------------

      const searchText = filters.search.trim().toLowerCase();

      if (searchText) {
        const invoice =
          typeof payment?.invoiceId === "object"
            ? payment.invoiceId
            : payment?.invoice;

        const searchableText = [
          payment?._id,
          payment?.id,

          payment?.invoiceNumber,
          payment?.invoiceNo,

          invoice?.invoiceNumber,
          invoice?.invoiceNo,

          payment?.transactionReference,
          payment?.referenceNumber,
          payment?.transactionId,
          payment?.reference,

          payment?.paymentMethod,
          payment?.method,

          payment?.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchText)) {
          return false;
        }
      }

      // --------------------------------------
      // STATUS
      // --------------------------------------

      if (filters.status !== "All") {
        const paymentStatus = String(payment?.status || "Pending")
          .trim()
          .toLowerCase();

        if (paymentStatus !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // --------------------------------------
      // PAYMENT METHOD
      // --------------------------------------

      if (filters.paymentMethod !== "All") {
        const method = String(payment?.paymentMethod || payment?.method || "")
          .trim()
          .toLowerCase();

        if (method !== filters.paymentMethod.toLowerCase()) {
          return false;
        }
      }

      // --------------------------------------
      // DATE
      // --------------------------------------

      if (filters.date) {
        const paymentDate =
          payment?.paymentDate || payment?.date || payment?.createdAt;

        if (!paymentDate) {
          return false;
        }

        const selectedDate = new Date(filters.date).toISOString().split("T")[0];

        const recordDate = new Date(paymentDate).toISOString().split("T")[0];

        if (selectedDate !== recordDate) {
          return false;
        }
      }

      return true;
    });
  }, [payments, filters]);

  // ==========================================
  // CALCULATE TOTAL INVOICE AMOUNT
  // ==========================================

  const totalInvoiceAmount = useMemo(() => {
    return payments.reduce(
      (total, payment) => {
        const invoice =
          typeof payment?.invoiceId === "object"
            ? payment.invoiceId
            : payment?.invoice;

        const invoiceAmount =
          payment?.invoiceAmount ??
          invoice?.totalAmount ??
          invoice?.grandTotal ??
          invoice?.amount ??
          0;

        return total + toNumber(invoiceAmount);
      },

      0,
    );
  }, [payments]);

  // ==========================================
  // CALCULATE TOTAL PAID
  // ==========================================

  const totalPaidAmount = useMemo(() => {
    return calculatePaidAmount(payments);
  }, [payments]);

  // ==========================================
  // VIEW PAYMENT
  // ==========================================

  const handleView = (payment) => {
    const paymentId = payment?._id || payment?.id;

    if (!paymentId) {
      return;
    }

    router.push(`/admin1/payment/view/${paymentId}`);
  };

  // ==========================================
  // EDIT PAYMENT
  // ==========================================

  const handleEdit = (payment) => {
    const paymentId = payment?._id || payment?.id;

    if (!paymentId) {
      return;
    }

    router.push(`/admin1/payment/edit/${paymentId}`);
  };

  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const handleDelete = (payment) => {
    setSelectedPayment(payment);

    setDeleteModalOpen(true);
  };

  // ==========================================
  // DELETE SUCCESS
  // ==========================================

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);

    setSelectedPayment(null);

    getPaymentsData();
  };

  // ==========================================
  // CLOSE DELETE MODAL
  // ==========================================

  const handleCloseDeleteModal = () => {
    if (loading) {
      return;
    }

    setDeleteModalOpen(false);

    setSelectedPayment(null);
  };

  // ==========================================
  // ADD PAYMENT
  // ==========================================

  const handleAddPayment = () => {
    router.push("/admin1/payment/add");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* ====================================
            PAGE HEADER
        ===================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <CreditCard size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Payment Tracking
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and track invoice payments
              </p>
            </div>
          </div>

          {/* =================================
              HEADER ACTIONS
          ================================== */}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={getPaymentsData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAddPayment}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Payment
            </button>
          </div>
        </div>

        {/* ====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              type="button"
              onClick={getPaymentsData}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ====================================
            SUMMARY
        ===================================== */}

        <div className="mb-6">
          <PaymentSummary
            invoiceAmount={totalInvoiceAmount}
            payments={payments}
          />
        </div>

        {/* ====================================
            SEARCH & FILTER
        ===================================== */}

        <div className="mb-6">
          <SearchFilter
            totalResults={filteredPayments.length}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* ====================================
            PAYMENT TABLE
        ===================================== */}

        <PaymentTable
          payments={filteredPayments}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* ====================================
            DELETE MODAL
        ===================================== */}

        <DeleteModal
          payment={selectedPayment}
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
}

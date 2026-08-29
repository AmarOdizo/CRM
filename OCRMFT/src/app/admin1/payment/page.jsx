"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CreditCard, Plus, RefreshCw } from "lucide-react";

import { getPayments } from "./data";

import PaymentSummary from "./paymentcomponents/PaymentSummary";
import SearchFilter from "./paymentcomponents/SearchFilter";
import PaymentTable from "./paymentcomponents/PaymentTable";
import DeleteModal from "./paymentcomponents/DeleteModal";
import PaymentForm from "./paymentcomponents/PaymentForm";
import { Modal } from "antd";

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
  const [formModalOpen, setFormModalOpen] = useState(false);
  const isEditMode = Boolean(selectedPayment);

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
    setSelectedPayment(payment);
    setFormModalOpen(true);
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
    setSelectedPayment(null);
    setFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Payment Tracking</h1>
            <p className="mt-1 text-slate-500 font-medium">Record client transactions, trace pending invoices, and log receipts.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={getPaymentsData}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : ""} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleAddPayment}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Payment</span>
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-800">{error}</p>
              <button
                type="button"
                onClick={getPaymentsData}
                className="mt-1.5 text-xs font-bold text-rose-700 underline hover:text-rose-950"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        <PaymentSummary
          invoiceAmount={totalInvoiceAmount}
          payments={payments}
        />

        {/* SEARCH & FILTER */}
        <SearchFilter
          totalResults={filteredPayments.length}
          onFilterChange={handleFilterChange}
        />

        {/* PAYMENT TABLE */}
        <PaymentTable
          payments={filteredPayments}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* DELETE MODAL */}
        <DeleteModal
          payment={selectedPayment}
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />

        {/* FORM DIALOG MODAL */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
              <CreditCard className="text-blue-500 animate-pulse" size={18} />
              <span className="font-extrabold text-lg">{isEditMode ? "Edit Payment Details" : "Record Client Payment"}</span>
            </div>
          }
          open={formModalOpen}
          onCancel={() => setFormModalOpen(false)}
          footer={null}
          width={700}
          destroyOnHidden
          centered
          className="payment-form-modal"
          styles={{ mask: { backdropFilter: "blur(4px)" } }}
        >
          <div className="mt-4 max-h-[80vh] overflow-y-auto px-1">
            <PaymentForm
              payment={selectedPayment}
              onSuccess={() => {
                setFormModalOpen(false);
                setSelectedPayment(null);
                getPaymentsData();
              }}
              onCancel={() => setFormModalOpen(false)}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

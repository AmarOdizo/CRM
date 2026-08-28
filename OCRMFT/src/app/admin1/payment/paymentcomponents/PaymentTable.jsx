"use client";

import {
  CalendarDays,
  CreditCard,
  FileText,
  IndianRupee,
  ReceiptText,
} from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import PaymentBadge from "./PaymentBadge";
import PaymentActions from "./PaymentActions";

import {
  formatCurrency,
  formatDate,
  formatPaymentMethod,
  formatReference,
} from "../utils";

export default function PaymentTable({
  payments = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!Array.isArray(payments) || payments.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <ReceiptText size={26} />
          </div>

          <h3 className="text-base font-bold text-gray-800">
            No payments found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            There are no payment records matching your current search or filter.
          </p>
        </div>
      </div>
    );
  }

  const columnDefs = [
    {
      headerName: "Invoice Details",
      field: "invoiceNumber",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => {
        const invoice =
          typeof params.data?.invoiceId === "object"
            ? params.data.invoiceId
            : params.data?.invoice;

        const invoiceNumber =
          invoice?.invoiceNumber ||
          invoice?.invoiceNo ||
          invoice?.number ||
          params.data?.invoiceNumber ||
          params.data?.invoiceNo ||
          params.data?.invoiceId ||
          "-";

        const paymentId = params.data?._id || params.data?.id;

        return (
          <div className="flex items-center gap-3 h-full py-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={14} />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-bold text-slate-800">
                {invoiceNumber}
              </p>
              {paymentId && (
                <p className="truncate text-[9px] text-slate-400 font-mono">
                  #{paymentId}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Payment Date",
      field: "paymentDate",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => {
        const paymentDate =
          params.data?.paymentDate || params.data?.date || params.data?.createdAt;

        return (
          <div className="flex items-center gap-2 text-xs text-slate-600 h-full font-semibold">
            <CalendarDays
              size={13}
              className="shrink-0 text-slate-400"
            />
            <span>{params.context.formatDate(paymentDate)}</span>
          </div>
        );
      },
    },
    {
      headerName: "Amount",
      field: "amount",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => {
        const amount =
          params.data?.amount ??
          params.data?.paidAmount ??
          params.data?.paymentAmount ??
          0;

        return (
          <div className="flex items-center gap-1.5 h-full font-mono text-xs font-bold text-emerald-600">
            <span>{params.context.formatCurrency(amount)}</span>
          </div>
        );
      },
    },
    {
      headerName: "Method",
      field: "paymentMethod",
      flex: 1.5,
      minWidth: 140,
      cellRenderer: (params) => {
        const paymentMethod =
          params.data?.paymentMethod || params.data?.method || "-";

        return (
          <div className="flex items-center gap-2 h-full text-xs text-slate-600 font-semibold">
            <CreditCard size={13} className="text-slate-400" />
            <span>
              {params.context.formatPaymentMethod(paymentMethod)}
            </span>
          </div>
        );
      },
    },
    {
      headerName: "Reference / Transaction ID",
      field: "reference",
      flex: 1.8,
      minWidth: 180,
      cellRenderer: (params) => {
        const reference =
          params.data?.transactionReference ||
          params.data?.referenceNumber ||
          params.data?.transactionId ||
          params.data?.reference ||
          "-";

        return (
          <span
            className="block max-w-[180px] truncate text-xs text-slate-500 font-mono self-center font-medium"
            title={reference}
          >
            {params.context.formatReference(reference)}
          </span>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1.2,
      minWidth: 110,
      cellRenderer: (params) => {
        const status = params.value || "Pending";
        return (
          <div className="flex items-center h-full">
            <PaymentBadge status={status} />
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-end h-full">
          <PaymentActions
            payment={params.data}
            onView={params.context.onView}
            onEdit={params.context.onEdit}
            onDelete={params.context.onDelete}
          />
        </div>
      ),
      width: 100,
      suppressMenu: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* AG Grid Table */}
      <div className="w-full ag-theme-quartz">
        <AgGridReact
          rowData={payments}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={52}
          headerHeight={44}
          context={{
            onView,
            onEdit,
            onDelete,
            formatCurrency,
            formatDate,
            formatPaymentMethod,
            formatReference,
          }}
        />
      </div>

      {/* ========================================
          FOOTER
      ========================================= */}

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{payments.length}</span>{" "}
          payment
          {payments.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

"use client";

import { FileText } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import QuotationBadge from "./QuotationBadge";
import QuotationActions from "./QuotationActions";

export default function QuotationTable({
  quotations = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  // Loading state
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-center px-6 py-16">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-gray-500">Loading quotations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!quotations || quotations.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No Quotations Found
          </h3>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            There are no quotations available to display.
          </p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Currency format
  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  // Get quotation number
  const getQuotationNumber = (quotation) => {
    return (
      quotation?.quotationNumber ||
      quotation?.quotationNo ||
      quotation?.quoteNumber ||
      quotation?.number ||
      `#${quotation?._id || quotation?.id || "-"}`
    );
  };

  // Get customer name
  const getCustomerName = (quotation) => {
    return (
      quotation?.customerName ||
      quotation?.customer?.name ||
      quotation?.customer?.customerName ||
      quotation?.customer?.companyName ||
      "N/A"
    );
  };

  // Get customer email
  const getCustomerEmail = (quotation) => {
    return (
      quotation?.customerEmail ||
      quotation?.customer?.email ||
      quotation?.email ||
      ""
    );
  };

  // Get total amount
  const getTotalAmount = (quotation) => {
    return (
      quotation?.grandTotal ??
      quotation?.totalAmount ??
      quotation?.total ??
      quotation?.amount ??
      0
    );
  };

  // Get customer initials
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const columnDefs = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 55,
      suppressMenu: true,
      sortable: false,
    },
    {
      headerName: "Quotation Ref",
      field: "quotationNumber",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-left">
          <button
            type="button"
            onClick={() => params.context.onView?.(params.data)}
            className="text-left font-bold text-blue-600 hover:text-blue-700 hover:underline text-xs"
          >
            {params.context.getQuotationNumber(params.data)}
          </button>
          {params.data.title && (
            <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-slate-400 font-medium">
              {params.data.title}
            </p>
          )}
        </div>
      ),
    },
    {
      headerName: "Customer / Contact",
      field: "customerName",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => {
        const name = params.context.getCustomerName(params.data);
        const email = params.context.getCustomerEmail(params.data);
        const initials = getInitials(name);
        return (
          <div className="flex items-center gap-2.5 h-full py-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white uppercase select-none">
              {initials || "?"}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-bold text-slate-700">
                {name}
              </p>
              {email && (
                <p className="truncate text-[10px] text-slate-400 font-medium">
                  {email}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Quotation Date",
      field: "quotationDate",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => {
        return params.data.quotationDate || params.data.date || params.data.createdAt;
      },
      cellRenderer: (params) => (
        <span className="text-xs font-semibold text-slate-500">
          {formatDate(params.value)}
        </span>
      ),
    },
    {
      headerName: "Total Value",
      field: "totalAmount",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => params.context.getTotalAmount(params.data),
      cellRenderer: (params) => (
        <span className="text-xs font-bold font-mono text-slate-700 block text-right w-full">
          {formatAmount(params.value)}
        </span>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1.1,
      minWidth: 110,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full">
          <QuotationBadge status={params.value || "draft"} size="sm" />
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full py-1">
          <QuotationActions
            quotation={params.data}
            onView={params.context.onView}
            onEdit={params.context.onEdit}
            onDelete={params.context.onDelete}
          />
        </div>
      ),
      width: 110,
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
      {/* Desktop Table */}
      <div className="hidden md:block ag-theme-quartz w-full">
        <AgGridReact
          rowData={quotations}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={52}
          headerHeight={44}
          context={{
            onView,
            onEdit,
            onDelete,
            getQuotationNumber,
            getCustomerName,
            getCustomerEmail,
            getTotalAmount,
          }}
        />
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-slate-100 md:hidden">
        {quotations.map((quotation, index) => {
          const id = quotation?._id || quotation?.id;
          const quotationNumber = getQuotationNumber(quotation);
          const customerName = getCustomerName(quotation);
          const customerEmail = getCustomerEmail(quotation);
          const totalAmount = getTotalAmount(quotation);
          const quotationDate =
            quotation?.quotationDate || quotation?.date || quotation?.createdAt;

          return (
            <div key={id || index} className="p-4 transition hover:bg-slate-50/50">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onView?.(quotation)}
                    className="text-left"
                  >
                    <p className="truncate text-xs font-bold text-blue-600">
                      {quotationNumber}
                    </p>
                  </button>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {customerName}
                  </p>
                  {customerEmail && (
                    <p className="truncate text-[10px] text-slate-400 font-medium">
                      {customerEmail}
                    </p>
                  )}
                </div>
                <QuotationBadge status={quotation?.status || "draft"} size="sm" />
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50/50 p-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">
                    {formatDate(quotationDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount</p>
                  <p className="mt-1 text-xs font-bold font-mono text-slate-700">
                    {formatAmount(totalAmount)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex justify-end">
                <QuotationActions
                  quotation={quotation}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Total:{" "}
          <span className="font-bold text-slate-600">
            {quotations.length}
          </span>{" "}
          quotation{quotations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

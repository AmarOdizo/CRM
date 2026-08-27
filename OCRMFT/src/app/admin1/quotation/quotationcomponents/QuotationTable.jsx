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

  const columnDefs = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      suppressMenu: true,
      sortable: false,
    },
    {
      headerName: "Quotation",
      field: "quotationNumber",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight text-left">
          <button
            type="button"
            onClick={() => params.context.onView?.(params.data)}
            className="text-left font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {params.context.getQuotationNumber(params.data)}
          </button>
          {params.data.title && (
            <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-500">
              {params.data.title}
            </p>
          )}
        </div>
      ),
    },
    {
      headerName: "Customer",
      field: "customerName",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <p className="truncate text-sm font-medium text-gray-800">
            {params.context.getCustomerName(params.data)}
          </p>
          {params.context.getCustomerEmail(params.data) && (
            <p className="truncate text-xs text-gray-500">
              {params.context.getCustomerEmail(params.data)}
            </p>
          )}
        </div>
      ),
    },
    {
      headerName: "Date",
      field: "quotationDate",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => {
        return params.data.quotationDate || params.data.date || params.data.createdAt;
      },
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: "Amount",
      field: "totalAmount",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => params.context.getTotalAmount(params.data),
      valueFormatter: (params) => formatAmount(params.value),
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full">
          <QuotationBadge status={params.value || "draft"} />
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
      width: 120,
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
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block ag-theme-quartz w-full">
        <AgGridReact
          rowData={quotations}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={50}
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
      <div className="divide-y divide-gray-100 md:hidden">
        {quotations.map((quotation, index) => {
          const id = quotation?._id || quotation?.id;

          const quotationNumber = getQuotationNumber(quotation);

          const customerName = getCustomerName(quotation);

          const customerEmail = getCustomerEmail(quotation);

          const totalAmount = getTotalAmount(quotation);

          const quotationDate =
            quotation?.quotationDate || quotation?.date || quotation?.createdAt;

          return (
            <div key={id || index} className="p-4 transition hover:bg-gray-50">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onView?.(quotation)}
                    className="text-left"
                  >
                    <p className="truncate text-sm font-bold text-blue-600">
                      {quotationNumber}
                    </p>
                  </button>

                  <p className="mt-1 truncate text-sm font-medium text-gray-800">
                    {customerName}
                  </p>

                  {customerEmail && (
                    <p className="truncate text-xs text-gray-500">
                      {customerEmail}
                    </p>
                  )}
                </div>

                <QuotationBadge status={quotation?.status || "draft"} />
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                <div>
                  <p className="text-xs text-gray-500">Date</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatDate(quotationDate)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Amount</p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatAmount(totalAmount)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end">
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
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
        <p className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {quotations.length}
          </span>{" "}
          quotation{quotations.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

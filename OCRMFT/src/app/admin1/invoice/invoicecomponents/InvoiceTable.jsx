"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  RefreshCw,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import InvoiceActions from "./InvoiceActions";
import SearchFilter from "./SearchFilter";
import DeleteModal from "./DeleteModal";
import ExportCSV from "./ExportCSV";
import { getInvoices, deleteInvoice } from "../data";

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --------------------------------------------------
  // GET ALL INVOICES
  // --------------------------------------------------

  const fetchInvoices = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const invoiceData = await getInvoices();
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
    } catch (err) {
      console.error("Fetch invoices error:", err);

      setError(err.message || "Unable to load invoices.");

      setInvoices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // --------------------------------------------------
  // SEARCH + FILTER
  // --------------------------------------------------

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Search
    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((invoice) => {
        const invoiceNumber = String(
          invoice.invoiceNumber || invoice.invoiceNo || invoice.invoiceId || "",
        ).toLowerCase();

        const customerName = String(invoice.customerName || "").toLowerCase();

        const customerEmail = String(invoice.customerEmail || "").toLowerCase();

        const customerPhone = String(invoice.customerPhone || "").toLowerCase();

        return (
          invoiceNumber.includes(searchValue) ||
          customerName.includes(searchValue) ||
          customerEmail.includes(searchValue) ||
          customerPhone.includes(searchValue)
        );
      });
    }

    // Invoice Status
    if (status) {
      result = result.filter(
        (invoice) =>
          String(invoice.status || "").toLowerCase() === status.toLowerCase(),
      );
    }

    // Payment Status
    if (paymentStatus) {
      result = result.filter(
        (invoice) =>
          String(invoice.paymentStatus || "").toLowerCase() ===
          paymentStatus.toLowerCase(),
      );
    }

    // From Date
    if (dateFrom) {
      result = result.filter((invoice) => {
        if (!invoice.invoiceDate) return false;

        const invoiceDate = new Date(invoice.invoiceDate);

        const fromDate = new Date(dateFrom);

        invoiceDate.setHours(0, 0, 0, 0);
        fromDate.setHours(0, 0, 0, 0);

        return invoiceDate >= fromDate;
      });
    }

    // To Date
    if (dateTo) {
      result = result.filter((invoice) => {
        if (!invoice.invoiceDate) return false;

        const invoiceDate = new Date(invoice.invoiceDate);

        const toDate = new Date(dateTo);

        invoiceDate.setHours(23, 59, 59, 999);
        toDate.setHours(23, 59, 59, 999);

        return invoiceDate <= toDate;
      });
    }

    return result;
  }, [invoices, search, status, paymentStatus, dateFrom, dateTo]);

  // --------------------------------------------------
  // RESET PAGE WHEN FILTER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, paymentStatus, dateFrom, dateTo]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / itemsPerPage),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // DELETE - OPEN MODAL
  // --------------------------------------------------

  const handleDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteModalOpen(true);
  };

  // --------------------------------------------------
  // DELETE - CONFIRM
  // --------------------------------------------------

  const confirmDelete = async () => {
    if (!selectedInvoice) return;

    const invoiceId = selectedInvoice._id || selectedInvoice.id;

    if (!invoiceId) {
      setError("Invoice ID not found.");
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteInvoice(invoiceId);

      // Remove deleted invoice immediately
      setInvoices((prev) =>
        prev.filter((invoice) => {
          const id = invoice._id || invoice.id;

          return id !== invoiceId;
        }),
      );

      setDeleteModalOpen(false);
      setSelectedInvoice(null);

      // If current page becomes empty,
      // move to previous page.
      const remainingItems = filteredInvoices.length - 1;

      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingItems / itemsPerPage),
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("Delete invoice error:", err);

      setError(err.message || "Unable to delete invoice.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // FORMAT CURRENCY
  // --------------------------------------------------

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* -------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------- */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Invoice Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, view, edit and track all invoices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchInvoices(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>

          <ExportCSV
            invoices={filteredInvoices}
            filename="invoice-report.csv"
          />

          <Link
            href="/admin1/invoice/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FilePlus size={17} />
            Add Invoice
          </Link>
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* ERROR */}
      {/* -------------------------------------------- */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-medium">Something went wrong</p>

            <p className="mt-1 text-sm">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchInvoices(true)}
            className="text-sm font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* SEARCH FILTER */}
      {/* -------------------------------------------- */}

      <SearchFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onClear={clearFilters}
      />

      {/* -------------------------------------------- */}
      {/* RESULT SUMMARY */}
      {/* -------------------------------------------- */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Total{" "}
          <span className="font-semibold text-gray-700">
            {filteredInvoices.length}
          </span>{" "}
          invoice{filteredInvoices.length !== 1 ? "s" : ""} found
        </p>

        {(search || status || paymentStatus || dateFrom || dateTo) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* -------------------------------------------- */}
      {/* TABLE */}
      {/* -------------------------------------------- */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm ag-theme-quartz w-full">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <FilePlus size={25} className="text-gray-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-800">
                No invoices found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {search || status || paymentStatus || dateFrom || dateTo
                  ? "Try changing your search or filters."
                  : "Create your first invoice to get started."}
              </p>

              {(search ||
                status ||
                paymentStatus ||
                dateFrom ||
                dateTo) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <AgGridReact
            rowData={filteredInvoices}
            columnDefs={[
              {
                headerName: "Invoice",
                field: "invoiceNumber",
                flex: 1.5,
                minWidth: 150,
                cellRenderer: (params) => {
                  const invoiceId = params.data._id || params.data.id;
                  const invoiceNumber =
                    params.data.invoiceNumber ||
                    params.data.invoiceNo ||
                    params.data.invoiceId ||
                    `INV-${invoiceId}`;
                  return (
                    <div className="flex items-center h-full">
                      <Link
                        href={`/admin1/invoice/view/${invoiceId}`}
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {invoiceNumber}
                      </Link>
                    </div>
                  );
                },
              },
              {
                headerName: "Customer",
                field: "customerName",
                flex: 2,
                minWidth: 200,
                cellRenderer: (params) => (
                  <div className="flex flex-col justify-center h-full py-1 leading-tight text-left">
                    <p className="font-medium text-gray-800">
                      {params.data.customerName || "-"}
                    </p>
                    {params.data.customerEmail && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {params.data.customerEmail}
                      </p>
                    )}
                  </div>
                ),
              },
              {
                headerName: "Invoice Date",
                field: "invoiceDate",
                flex: 1.2,
                minWidth: 120,
                valueFormatter: (params) => formatDate(params.value),
              },
              {
                headerName: "Due Date",
                field: "dueDate",
                flex: 1.2,
                minWidth: 120,
                valueFormatter: (params) => formatDate(params.value),
              },
              {
                headerName: "Amount",
                field: "totalAmount",
                flex: 1.2,
                minWidth: 120,
                valueGetter: (params) =>
                  params.data.totalAmount ??
                  params.data.grandTotal ??
                  params.data.total ??
                  0,
                valueFormatter: (params) => formatCurrency(params.value),
                cellStyle: { textAlign: "right" },
              },
              {
                headerName: "Status",
                field: "status",
                flex: 1,
                minWidth: 100,
                cellRenderer: (params) => (
                  <div className="flex items-center justify-center h-full">
                    <StatusBadge status={params.value} />
                  </div>
                ),
              },
              {
                headerName: "Payment",
                field: "paymentStatus",
                flex: 1.2,
                minWidth: 120,
                cellRenderer: (params) => (
                  <div className="flex items-center justify-center h-full">
                    <PaymentBadge paymentStatus={params.value} />
                  </div>
                ),
              },
              {
                headerName: "Actions",
                cellRenderer: (params) => (
                  <div className="flex items-center justify-center h-full">
                    <InvoiceActions
                      invoice={params.data}
                      onDelete={handleDelete}
                    />
                  </div>
                ),
                width: 120,
                suppressMenu: true,
                sortable: false,
              },
            ]}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
            rowHeight={60}
            headerHeight={50}
          />
        )}
      </div>

      {/* -------------------------------------------- */}
      {/* DELETE MODAL */}
      {/* -------------------------------------------- */}

      <DeleteModal
        isOpen={deleteModalOpen}
        invoice={selectedInvoice}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(false);
            setSelectedInvoice(null);
          }
        }}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

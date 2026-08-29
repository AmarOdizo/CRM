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
  RefreshCw,
  Plus,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
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
  // STATS CALCULATIONS
  // --------------------------------------------------
  const totalInvoices = invoices.length;
  const totalAmountVal = invoices.reduce((acc, curr) => acc + Number(curr.totalAmount || curr.grandTotal || curr.total || 0), 0);
  const paidAmountVal = invoices
    .filter((i) => (i.paymentStatus || "").toLowerCase() === "paid")
    .reduce((acc, curr) => acc + Number(curr.totalAmount || curr.grandTotal || curr.total || 0), 0);
  const unpaidAmountVal = invoices
    .filter((i) => (i.paymentStatus || "").toLowerCase() !== "paid")
    .reduce((acc, curr) => acc + Number(curr.totalAmount || curr.grandTotal || curr.total || 0), 0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Invoices...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we retrieve invoice statements.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Invoice Management</h1>
          <p className="mt-1 text-slate-500 font-medium font-medium">
            Manage your company invoice statements, receipts, outstanding bills, and payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchInvoices(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <ExportCSV
            invoices={filteredInvoices}
            filename="invoice-report.csv"
          />

          <Link
            href="/admin1/invoice/add"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Invoice</span>
          </Link>
        </div>
      </div>

      {/* STATS BANNER */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Invoices",
            val: totalInvoices,
            icon: FileText,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "Outstanding Bills",
            val: formatCurrency(unpaidAmountVal),
            icon: Clock,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
          {
            title: "Paid Invoices",
            val: formatCurrency(paidAmountVal),
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "Total Volume",
            val: formatCurrency(totalAmountVal),
            icon: DollarSign,
            color: "text-purple-600 bg-purple-50/50 border-purple-200/50",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                  {loading ? "..." : card.val}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div className="flex-1">
            <p className="font-semibold text-sm">Something went wrong</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchInvoices(true)}
            className="text-sm font-semibold underline hover:text-rose-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* SEARCH FILTER */}
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

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm w-full">
        {filteredInvoices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
                <FileText size={25} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                No invoices found
              </h3>

              <p className="mt-1 text-sm text-slate-400 font-medium">
                {search || status || paymentStatus || dateFrom || dateTo
                  ? "Try changing your search or filters."
                  : "Create your first invoice statement to get started."}
              </p>

              {(search ||
                status ||
                paymentStatus ||
                dateFrom ||
                dateTo) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="ag-theme-quartz min-w-[1000px] w-full">
              <AgGridReact
                rowData={filteredInvoices}
                columnDefs={[
                  {
                    headerName: "Invoice Number",
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
                            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {invoiceNumber}
                          </Link>
                        </div>
                      );
                    },
                  },
                  {
                    headerName: "Customer Details",
                    field: "customerName",
                    flex: 2,
                    minWidth: 200,
                    cellRenderer: (params) => (
                      <div className="flex flex-col justify-center h-full py-1 leading-tight text-left">
                        <p className="font-bold text-slate-700">
                          {params.data.customerName || "-"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {params.data.customerEmail || ""}
                        </p>
                      </div>
                    ),
                  },
                  {
                    headerName: "Project Details",
                    field: "projectName",
                    flex: 1.5,
                    minWidth: 150,
                    cellRenderer: (params) => (
                      <div className="flex items-center h-full text-sm font-semibold text-slate-600">
                        {params.value || "-"}
                      </div>
                    ),
                  },
                  {
                    headerName: "Invoice Date",
                    field: "invoiceDate",
                    flex: 1.2,
                    minWidth: 120,
                    cellRenderer: (params) => (
                      <div className="flex items-center h-full text-sm text-slate-500">
                        {params.value ? formatDate(params.value) : "-"}
                      </div>
                    ),
                  },
                  {
                    headerName: "Due Date",
                    field: "dueDate",
                    flex: 1.2,
                    minWidth: 120,
                    cellRenderer: (params) => (
                      <div className="flex items-center h-full text-sm text-slate-500">
                        {params.value ? formatDate(params.value) : "-"}
                      </div>
                    ),
                  },
                  {
                    headerName: "Grand Total",
                    field: "grandTotal",
                    flex: 1.2,
                    minWidth: 120,
                    cellRenderer: (params) => (
                      <div className="flex items-center h-full text-sm font-bold text-slate-800">
                        {formatCurrency(params.value)}
                      </div>
                    ),
                  },
                  {
                    headerName: "Status",
                    field: "status",
                    flex: 1,
                    minWidth: 110,
                    cellRenderer: (params) => (
                      <div className="flex items-center h-full">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-none
                          ${
                            params.value === "Sent"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : params.value === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : params.value === "Overdue"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {params.value}
                        </span>
                      </div>
                    ),
                  },
                  {
                    headerName: "Actions",
                    cellRenderer: (params) => {
                      const invoiceId = params.data._id || params.data.id;
                      return (
                        <div className="flex items-center gap-1.5 h-full py-1">
                          <Link
                            href={`/admin1/invoice/view/${invoiceId}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
                            title="View Statement"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin1/invoice/edit/${invoiceId}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
                            title="Edit Invoice"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(params.data)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    },
                    width: 140,
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
                rowHeight={65}
                headerHeight={48}
              />
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
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

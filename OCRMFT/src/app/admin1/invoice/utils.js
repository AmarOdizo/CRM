// invoice-management/utils.js

// ==================================================
// GET INVOICE ID
// ==================================================

export const getInvoiceId = (invoice) => {
  if (!invoice) return "";

  return invoice._id || invoice.id || invoice.invoiceId || "";
};

// ==================================================
// GET INVOICE NUMBER
// ==================================================

export const getInvoiceNumber = (invoice) => {
  if (!invoice) return "";

  return invoice.invoiceNumber || invoice.invoiceNo || invoice.invoiceId || "";
};

// ==================================================
// FORMAT CURRENCY
// ==================================================

export const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// ==================================================
// FORMAT NUMBER
// ==================================================

export const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ==================================================
// FORMAT DATE
// ==================================================

export const formatDate = (date) => {
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

// ==================================================
// FORMAT DATE FOR INPUT
// ==================================================

export const formatDateForInput = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ==================================================
// CALCULATE ITEM AMOUNT
// ==================================================

export const calculateItemAmount = (quantity, rate) => {
  const qty = Number(quantity || 0);
  const itemRate = Number(rate || 0);

  return qty * itemRate;
};

// ==================================================
// CALCULATE SUBTOTAL
// ==================================================

export const calculateSubtotal = (items = []) => {
  return items.reduce((total, item) => {
    const quantity = Number(item.quantity || 0);

    const rate = Number(item.rate || 0);

    const amount = Number(item.amount ?? quantity * rate);

    return total + amount;
  }, 0);
};

// ==================================================
// CALCULATE TAX AMOUNT
// ==================================================

export const calculateTaxAmount = (subtotal, tax) => {
  const subTotalValue = Number(subtotal || 0);

  const taxValue = Number(tax || 0);

  return (subTotalValue * taxValue) / 100;
};

// ==================================================
// CALCULATE DISCOUNT AMOUNT
// ==================================================

export const calculateDiscountAmount = (subtotal, discount) => {
  const subTotalValue = Number(subtotal || 0);

  const discountValue = Number(discount || 0);

  return (subTotalValue * discountValue) / 100;
};

// ==================================================
// CALCULATE GRAND TOTAL
// ==================================================

export const calculateTotal = ({ subtotal = 0, tax = 0, discount = 0 }) => {
  const subTotalValue = Number(subtotal);

  const taxAmount = calculateTaxAmount(subTotalValue, tax);

  const discountAmount = calculateDiscountAmount(subTotalValue, discount);

  return subTotalValue + taxAmount - discountAmount;
};

// ==================================================
// CALCULATE COMPLETE INVOICE TOTALS
// ==================================================

export const calculateInvoiceTotals = (items = [], tax = 0, discount = 0) => {
  const subtotal = calculateSubtotal(items);

  const taxAmount = calculateTaxAmount(subtotal, tax);

  const discountAmount = calculateDiscountAmount(subtotal, discount);

  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
};

// ==================================================
// GET ITEM AMOUNT
// ==================================================

export const getItemAmount = (item) => {
  if (!item) return 0;

  if (item.amount !== undefined && item.amount !== null) {
    return Number(item.amount);
  }

  return calculateItemAmount(item.quantity, item.rate);
};

// ==================================================
// CHECK VALID INVOICE
// ==================================================

export const isValidInvoice = (invoice) => {
  if (!invoice) return false;

  if (!invoice.customerName || !String(invoice.customerName).trim()) {
    return false;
  }

  if (!invoice.invoiceDate) {
    return false;
  }

  if (!Array.isArray(invoice.items) || invoice.items.length === 0) {
    return false;
  }

  return true;
};

// ==================================================
// CHECK VALID EMAIL
// ==================================================

export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(String(email).trim());
};

// ==================================================
// CHECK VALID PHONE
// ==================================================

export const isValidPhone = (phone) => {
  if (!phone) return false;

  const phoneRegex = /^[6-9]\d{9}$/;

  return phoneRegex.test(String(phone).replace(/\s+/g, ""));
};

// ==================================================
// NORMALIZE INVOICE STATUS
// ==================================================

export const normalizeStatus = (status) => {
  if (!status) return "";

  return String(status).trim().toLowerCase();
};

// ==================================================
// NORMALIZE PAYMENT STATUS
// ==================================================

export const normalizePaymentStatus = (status) => {
  if (!status) return "";

  return String(status).trim().toLowerCase();
};

// ==================================================
// GET STATUS LABEL
// ==================================================

export const getStatusLabel = (status) => {
  if (!status) return "Unknown";

  const normalized = normalizeStatus(status);

  const labels = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
    cancelled: "Cancelled",
    pending: "Pending",
  };

  return labels[normalized] || String(status);
};

// ==================================================
// GET PAYMENT LABEL
// ==================================================

export const getPaymentLabel = (status) => {
  if (!status) return "Unknown";

  const normalized = normalizePaymentStatus(status);

  const labels = {
    paid: "Paid",
    pending: "Pending",
    partial: "Partially Paid",
    unpaid: "Unpaid",
    failed: "Failed",
    refunded: "Refunded",
  };

  return labels[normalized] || String(status);
};

// ==================================================
// GENERATE LOCAL INVOICE NUMBER
// ==================================================

export const generateInvoiceNumber = (count = 0) => {
  const nextNumber = Number(count || 0) + 1;

  return `INV-${String(nextNumber).padStart(5, "0")}`;
};

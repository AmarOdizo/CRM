// ==========================================
// PAYMENT TRACKING - UTILITY FUNCTIONS
// ==========================================

// ==========================================
// 1. NUMBER / PAYMENT AMOUNT
// ==========================================

// Convert any value into a safe number
export const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// Format amount with 2 decimal places
export const formatAmount = (amount) => {
  return toNumber(amount).toFixed(2);
};

// Format amount with Indian currency style
export const formatCurrency = (amount) => {
  return `₹${toNumber(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ==========================================
// 2. PAYMENT STATUS
// ==========================================

export const normalizeStatus = (status) => {
  if (!status) return "Pending";

  return String(status)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getPaymentStatus = ({ invoiceAmount = 0, paidAmount = 0 }) => {
  const invoice = toNumber(invoiceAmount);
  const paid = toNumber(paidAmount);

  if (paid <= 0) {
    return "Pending";
  }

  if (paid >= invoice && invoice > 0) {
    return "Paid";
  }

  if (paid > 0 && paid < invoice) {
    return "Partial";
  }

  return "Pending";
};

// Status badge class
export const getStatusClass = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  switch (normalizedStatus) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "partial":
      return "bg-yellow-100 text-yellow-700";

    case "pending":
      return "bg-red-100 text-red-700";

    case "overdue":
      return "bg-orange-100 text-orange-700";

    case "cancelled":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ==========================================
// 3. BALANCE / REMAINING AMOUNT
// ==========================================

// Calculate remaining amount
export const calculateRemaining = (totalAmount, paidAmount) => {
  const total = toNumber(totalAmount);
  const paid = toNumber(paidAmount);

  return Math.max(total - paid, 0);
};

// Calculate total paid
export const calculatePaidAmount = (payments = []) => {
  if (!Array.isArray(payments)) {
    return 0;
  }

  return payments.reduce((total, payment) => {
    return (
      total +
      toNumber(
        payment.amount ?? payment.paidAmount ?? payment.paymentAmount ?? 0,
      )
    );
  }, 0);
};

// Calculate balance from invoice and payments
export const calculateBalance = (invoiceAmount, payments = []) => {
  const totalPaid = calculatePaidAmount(payments);

  return calculateRemaining(invoiceAmount, totalPaid);
};

// ==========================================
// 4. PAYMENT PERCENTAGE
// ==========================================

export const calculatePaymentPercentage = (totalAmount, paidAmount) => {
  const total = toNumber(totalAmount);
  const paid = toNumber(paidAmount);

  if (total <= 0) {
    return 0;
  }

  return Math.min((paid / total) * 100, 100);
};

// ==========================================
// 5. DATE FORMATTING
// ==========================================

// Format date as DD/MM/YYYY
export const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date as readable format
// Example: 20 Aug 2026
export const formatReadableDate = (date) => {
  if (!date) {
    return "-";
  }

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

// Format date and time
export const formatDateTime = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ==========================================
// 6. PAYMENT METHOD
// ==========================================

export const formatPaymentMethod = (method) => {
  if (!method) {
    return "-";
  }

  return String(method)
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// ==========================================
// 7. PAYMENT REFERENCE
// ==========================================

export const formatReference = (reference) => {
  if (!reference) {
    return "-";
  }

  return String(reference).trim();
};

// ==========================================
// 8. PAYMENT TYPE
// ==========================================

export const formatPaymentType = (type) => {
  if (!type) {
    return "-";
  }

  return String(type)
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// ==========================================
// 9. GET PAYMENT STATUS FROM BALANCE
// ==========================================

export const getStatusFromAmount = (invoiceAmount, paidAmount) => {
  const total = toNumber(invoiceAmount);
  const paid = toNumber(paidAmount);

  if (paid <= 0) {
    return "Pending";
  }

  if (paid >= total && total > 0) {
    return "Paid";
  }

  if (paid > 0 && paid < total) {
    return "Partial";
  }

  return "Pending";
};

// ==========================================
// 10. PAYMENT SUMMARY
// ==========================================

export const getPaymentSummary = (invoiceAmount, payments = []) => {
  const totalInvoiceAmount = toNumber(invoiceAmount);

  const totalPaidAmount = calculatePaidAmount(payments);

  const remainingAmount = calculateRemaining(
    totalInvoiceAmount,
    totalPaidAmount,
  );

  const percentage = calculatePaymentPercentage(
    totalInvoiceAmount,
    totalPaidAmount,
  );

  const status = getPaymentStatus({
    invoiceAmount: totalInvoiceAmount,
    paidAmount: totalPaidAmount,
  });

  return {
    totalInvoiceAmount,
    totalPaidAmount,
    remainingAmount,
    percentage,
    status,
  };
};

// ==========================================
// 11. PAYMENT VALIDATION
// ==========================================

export const validatePaymentAmount = (amount, remainingAmount) => {
  const payment = toNumber(amount);
  const remaining = toNumber(remainingAmount);

  if (payment <= 0) {
    return "Payment amount must be greater than 0";
  }

  if (payment > remaining) {
    return "Payment amount cannot be greater than remaining amount";
  }

  return null;
};

// ==========================================
// 12. SAFE TEXT FORMAT
// ==========================================

export const formatText = (value, fallback = "-") => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return fallback;
  }

  return String(value).trim();
};

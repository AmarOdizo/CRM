// ============================================================
// QUOTATION UTILS
// ============================================================

// ============================================================
// CURRENCY FORMAT
// ============================================================

export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// ============================================================
// NUMBER FORMAT
// ============================================================

export const formatNumber = (number, decimals = 2) => {
  const value = Number(number) || 0;

  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,

    maximumFractionDigits: decimals,
  });
};

// ============================================================
// CALCULATE GROSS AMOUNT
// quantity × rate
// ============================================================

export const calculateGrossAmount = (quantity, rate) => {
  const qty = Number(quantity) || 0;

  const price = Number(rate) || 0;

  return Number((qty * price).toFixed(2));
};

// ============================================================
// CALCULATE DISCOUNT AMOUNT
// ============================================================

export const calculateDiscountAmount = (grossAmount, discount) => {
  const amount = Number(grossAmount) || 0;

  const discountPercent = Number(discount) || 0;

  return Number(((amount * discountPercent) / 100).toFixed(2));
};

// ============================================================
// CALCULATE TAXABLE AMOUNT
// ============================================================

export const calculateTaxableAmount = (grossAmount, discount) => {
  const amount = Number(grossAmount) || 0;

  const discountAmount = Number(discount) || 0;

  return Number((amount - discountAmount).toFixed(2));
};

// ============================================================
// CALCULATE TAX AMOUNT
// ============================================================

export const calculateTaxAmount = (taxableAmount, tax) => {
  const amount = Number(taxableAmount) || 0;

  const taxPercent = Number(tax) || 0;

  return Number(((amount * taxPercent) / 100).toFixed(2));
};

// ============================================================
// CALCULATE ITEM TOTAL
// ============================================================

export const calculateItemAmount = (item = {}) => {
  const quantity = Number(item.quantity) || 0;

  const rate = Number(item.rate) || 0;

  const discount = Number(item.discount) || 0;

  const tax = Number(item.tax) || 0;

  const grossAmount = calculateGrossAmount(quantity, rate);

  const discountAmount = calculateDiscountAmount(grossAmount, discount);

  const taxableAmount = calculateTaxableAmount(grossAmount, discountAmount);

  const taxAmount = calculateTaxAmount(taxableAmount, tax);

  const finalAmount = taxableAmount + taxAmount;

  return Number(finalAmount.toFixed(2));
};

// ============================================================
// CALCULATE ALL QUOTATION TOTALS
// ============================================================

export const calculateQuotationTotals = (items = []) => {
  let subtotal = 0;

  let totalDiscount = 0;

  let totalTax = 0;

  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity) || 0;

    const rate = Number(item.rate) || 0;

    const discount = Number(item.discount) || 0;

    const tax = Number(item.tax) || 0;

    // ------------------------------------------
    // GROSS
    // ------------------------------------------

    const grossAmount = calculateGrossAmount(quantity, rate);

    // ------------------------------------------
    // DISCOUNT
    // ------------------------------------------

    const discountAmount = calculateDiscountAmount(grossAmount, discount);

    // ------------------------------------------
    // TAXABLE
    // ------------------------------------------

    const taxableAmount = calculateTaxableAmount(grossAmount, discountAmount);

    // ------------------------------------------
    // TAX
    // ------------------------------------------

    const taxAmount = calculateTaxAmount(taxableAmount, tax);

    // ------------------------------------------
    // FINAL AMOUNT
    // ------------------------------------------

    const amount = Number((taxableAmount + taxAmount).toFixed(2));

    subtotal += grossAmount;

    totalDiscount += discountAmount;

    totalTax += taxAmount;

    return {
      ...item,

      quantity,

      rate,

      discount,

      tax,

      amount,
    };
  });

  const grandTotal = subtotal - totalDiscount + totalTax;

  return {
    items: calculatedItems,

    subtotal: Number(subtotal.toFixed(2)),

    totalDiscount: Number(totalDiscount.toFixed(2)),

    totalTax: Number(totalTax.toFixed(2)),

    grandTotal: Number(grandTotal.toFixed(2)),
  };
};

// ============================================================
// FORMAT DATE
// ============================================================

export const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// FORMAT DATE FOR INPUT
// YYYY-MM-DD
// ============================================================

export const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ============================================================
// FORMAT DATETIME
// ============================================================

export const formatDateTime = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// QUOTATION STATUS LIST
// ============================================================

export const quotationStatuses = [
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
  "Converted",
];

// ============================================================
// CHECK VALID STATUS
// ============================================================

export const isValidQuotationStatus = (status) => {
  return quotationStatuses.includes(status);
};

// ============================================================
// FORMAT STATUS
// ============================================================

export const formatQuotationStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// ============================================================
// STATUS STYLE
// ============================================================

export const getQuotationStatusStyle = (status) => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-700";

    case "Sent":
      return "bg-blue-100 text-blue-700";

    case "Accepted":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    case "Expired":
      return "bg-orange-100 text-orange-700";

    case "Converted":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ============================================================
// QUOTATION NUMBER VALIDATION
// ============================================================

export const isValidQuotationNumber = (quotationNumber) => {
  if (!quotationNumber) {
    return false;
  }

  const pattern = /^QTN-\d{4}-\d{4}$/;

  return pattern.test(quotationNumber);
};

// ============================================================
// GET QUOTATION NUMBER
// ============================================================

export const getQuotationNumber = (quotation) => {
  return quotation?.quotationNumber || "N/A";
};

// ============================================================
// GET CUSTOMER NAME
// ============================================================

export const getCustomerName = (quotation) => {
  return quotation?.customerName || "Unknown Customer";
};

// ============================================================
// GET ITEM COUNT
// ============================================================

export const getQuotationItemCount = (quotation) => {
  if (!Array.isArray(quotation?.items)) {
    return 0;
  }

  return quotation.items.length;
};

// ============================================================
// CHECK QUOTATION EXPIRY
// ============================================================

export const isQuotationExpired = (validUntil) => {
  if (!validUntil) {
    return false;
  }

  const expiryDate = new Date(validUntil);

  if (Number.isNaN(expiryDate.getTime())) {
    return false;
  }

  // Set end of day
  expiryDate.setHours(23, 59, 59, 999);

  return expiryDate.getTime() < new Date().getTime();
};

// ============================================================
// GET QUOTATION STATUS WITH EXPIRY
// ============================================================

export const getEffectiveQuotationStatus = (quotation) => {
  if (!quotation) {
    return "Draft";
  }

  if (quotation.status === "Draft" || quotation.status === "Sent") {
    if (isQuotationExpired(quotation.validUntil)) {
      return "Expired";
    }
  }

  return quotation.status || "Draft";
};

// ============================================================
// ROUND AMOUNT
// ============================================================

export const roundAmount = (amount) => {
  return Number((Number(amount) || 0).toFixed(2));
};

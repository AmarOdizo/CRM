// Format Date

export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format Currency

export const formatCurrency = (amount) => {
  if (!amount) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Percentage

export const percentage = (value, total) => {
  if (!total) return "0%";

  return ((value / total) * 100).toFixed(1) + "%";
};

const API_URL = "http://localhost:5000/api/Payment";

// ===============================
// GET ALL PAYMENTS
// GET /api/Payment
// ===============================
export const getPayments = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch payments");
    }

    return data;
  } catch (error) {
    console.error("getPayments Error:", error);
    throw error;
  }
};

// ===============================
// GET PAYMENT BY ID
// GET /api/Payment/:id
// ===============================
export const getPaymentById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch payment");
    }

    return data;
  } catch (error) {
    console.error("getPaymentById Error:", error);
    throw error;
  }
};

// ===============================
// GET PAYMENTS BY INVOICE ID
// GET /api/Payment/invoice/:invoiceId
// ===============================
export const getPaymentsByInvoice = async (invoiceId) => {
  try {
    const response = await fetch(`${API_URL}/invoice/${invoiceId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch invoice payments");
    }

    return data;
  } catch (error) {
    console.error("getPaymentsByInvoice Error:", error);
    throw error;
  }
};

// ===============================
// CREATE PAYMENT
// POST /api/Payment
// ===============================
export const createPayment = async (paymentData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment");
    }

    return data;
  } catch (error) {
    console.error("createPayment Error:", error);
    throw error;
  }
};

// ===============================
// UPDATE PAYMENT
// PUT /api/Payment/:id
// ===============================
export const updatePayment = async (id, paymentData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update payment");
    }

    return data;
  } catch (error) {
    console.error("updatePayment Error:", error);
    throw error;
  }
};

// ===============================
// DELETE PAYMENT
// DELETE /api/Payment/:id
// ===============================
export const deletePayment = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete payment");
    }

    return data;
  } catch (error) {
    console.error("deletePayment Error:", error);
    throw error;
  }
};

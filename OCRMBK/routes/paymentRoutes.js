const express = require("express");
const mongoose = require("mongoose");

const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

const router = express.Router();

// Helper to sync payment details onto the Invoice
const updateInvoicePaymentStatus = async (invoiceId) => {
  try {
    const completedPayments = await Payment.find({
      invoiceId,
      status: "Completed",
    });

    const totalPaid = completedPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) return;

    invoice.paidAmount = totalPaid;

    if (totalPaid >= invoice.totalAmount) {
      invoice.paymentStatus = "Paid";
    } else if (totalPaid > 0) {
      invoice.paymentStatus = "Partially Paid";
    } else {
      invoice.paymentStatus = "Pending";
    }

    await invoice.save();
  } catch (err) {
    console.error("Error updating invoice payment status:", err);
  }
};

// ==================================================
// CREATE PAYMENT
// POST /api/Payment
// ==================================================

router.post("/", async (req, res) => {
  try {
    const {
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      transactionId,
      status,
      notes,
    } = req.body;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID.",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0.",
      });
    }

    // Find existing invoice
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    const transactionIdOrRef = transactionId || req.body.transactionReference || "";

    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount: Number(amount),
      paymentMethod,
      paymentDate: paymentDate || new Date(),
      transactionId: transactionIdOrRef,
      status: status || "Completed",
      notes: notes || "",
    });

    await updateInvoicePaymentStatus(invoiceId);

    return res.status(201).json({
      success: true,
      message: "Payment added successfully.",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add payment.",
      error: error.message,
    });
  }
});

// ==================================================
// GET ALL PAYMENTS
// GET /api/Payment
// ==================================================

router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("invoiceId", "invoiceNumber clientName customerName totalAmount paidAmount")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
});

// ==================================================
// GET PAYMENT BY ID
// GET /api/Payment/:id
// ==================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const payment = await Payment.findById(id).populate(
      "invoiceId",
      "invoiceNumber clientName customerName totalAmount paidAmount",
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment.",
      error: error.message,
    });
  }
});

// ==================================================
// GET PAYMENTS BY INVOICE
// GET /api/Payment/invoice/:invoiceId
// ==================================================

router.get("/invoice/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID.",
      });
    }

    const payments = await Payment.find({
      invoiceId,
    }).sort({
      paymentDate: -1,
      createdAt: -1,
    });

    const totalPaid = payments
      .filter((payment) => payment.status === "Completed")
      .reduce((total, payment) => total + Number(payment.amount), 0);

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalPaid,
      payments,
    });
  } catch (error) {
    console.error("Get invoice payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice payments.",
      error: error.message,
    });
  }
});

// ==================================================
// UPDATE PAYMENT
// PUT /api/Payment/:id
// ==================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const { amount, paymentMethod, paymentDate, transactionId, status, notes } =
      req.body;

    const transactionIdOrRef = transactionId !== undefined ? transactionId : req.body.transactionReference;

    const payment = await Payment.findByIdAndUpdate(
      id,
      {
        ...(amount !== undefined && {
          amount: Number(amount),
        }),

        ...(paymentMethod !== undefined && {
          paymentMethod,
        }),

        ...(paymentDate !== undefined && {
          paymentDate,
        }),

        ...(transactionIdOrRef !== undefined && {
          transactionId: transactionIdOrRef,
        }),

        ...(status !== undefined && {
          status,
        }),

        ...(notes !== undefined && {
          notes,
        }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await updateInvoicePaymentStatus(payment.invoiceId);

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully.",
      payment,
    });
  } catch (error) {
    console.error("Update payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment.",
      error: error.message,
    });
  }
});

// ==================================================
// DELETE PAYMENT
// DELETE /api/Payment/:id
// ==================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID.",
      });
    }

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    await updateInvoicePaymentStatus(payment.invoiceId);

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete payment.",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const { resolveClientRef } = require("../config/relationResolver");

// ======================================================
// GET ALL INVOICES
// GET /api/Invoice
// ======================================================

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("client").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices.",
      error: error.message,
    });
  }
});

// ======================================================
// GET SINGLE INVOICE
// GET /api/Invoice/:id
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("client");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice.",
      error: error.message,
    });
  }
});

// ======================================================
// CREATE INVOICE
// POST /api/Invoice
// ======================================================

router.post("/", async (req, res) => {
  try {
    const {
      invoiceDate,
      dueDate,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      paidAmount,
      notes,
    } = req.body;

    const finalClientName = clientName || req.body.customerName;
    const finalClientEmail = clientEmail || req.body.customerEmail;
    const finalClientPhone = clientPhone || req.body.customerPhone;
    const finalClientAddress = clientAddress || req.body.customerAddress;

    // -------------------------------
    // Required Validation
    // -------------------------------

    if (!finalClientName || !finalClientName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one invoice item is required.",
      });
    }

    // -------------------------------
    // Create Invoice
    // -------------------------------

    const invoice = new Invoice({
      invoiceDate,
      dueDate,
      clientName: finalClientName,
      client: await resolveClientRef(finalClientName),
      clientEmail: finalClientEmail,
      clientPhone: finalClientPhone,
      clientAddress: finalClientAddress,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      paidAmount,
      notes,
    });

    // IMPORTANT:
    // invoice.save() triggers the
    // Invoice.js pre("save") hook
    // and automatically generates:
    // INV-00001, INV-00002, etc.

    const savedInvoice = await invoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      data: savedInvoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create invoice.",
      error: error.message,
    });
  }
});

// ======================================================
// UPDATE INVOICE
// PUT /api/Invoice/:id
// ======================================================

router.put("/:id", async (req, res) => {
  try {
    const {
      invoiceDate,
      dueDate,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      paidAmount,
      notes,
    } = req.body;

    const finalClientName = clientName || req.body.customerName;
    const finalClientEmail = clientEmail || req.body.customerEmail;
    const finalClientPhone = clientPhone || req.body.customerPhone;
    const finalClientAddress = clientAddress || req.body.customerAddress;

    // -------------------------------
    // Required Validation
    // -------------------------------

    if (!finalClientName || !finalClientName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one invoice item is required.",
      });
    }

    // -------------------------------
    // Update
    // -------------------------------

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        invoiceDate,
        dueDate,
        clientName: finalClientName,
        client: await resolveClientRef(finalClientName),
        clientEmail: finalClientEmail,
        clientPhone: finalClientPhone,
        clientAddress: finalClientAddress,
        items,
        subtotal,
        tax,
        discount,
        totalAmount,
        paymentStatus,
        paymentMethod,
        paidAmount,
        notes,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update invoice.",
      error: error.message,
    });
  }
});

// ======================================================
// DELETE INVOICE
// DELETE /api/Invoice/:id
// ======================================================

router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("Delete invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete invoice.",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Quotation = require("../models/Quotation");

const { generateQuotationNumber } = require("../models/QuotationCounter");

// ============================================================
// HELPER: CHECK VALID MONGODB ID
// ============================================================

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ============================================================
// HELPER: CALCULATE QUOTATION TOTALS
// ============================================================

const calculateTotals = (items = []) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity) || 0;

    const rate = Number(item.rate) || 0;

    const discount = Number(item.discount) || 0;

    const tax = Number(item.tax) || 0;

    // ------------------------------------------
    // GROSS AMOUNT
    // ------------------------------------------

    const grossAmount = quantity * rate;

    // ------------------------------------------
    // DISCOUNT
    // ------------------------------------------

    const discountAmount = (grossAmount * discount) / 100;

    // ------------------------------------------
    // TAXABLE AMOUNT
    // ------------------------------------------

    const taxableAmount = grossAmount - discountAmount;

    // ------------------------------------------
    // TAX
    // ------------------------------------------

    const taxAmount = (taxableAmount * tax) / 100;

    // ------------------------------------------
    // FINAL ITEM AMOUNT
    // ------------------------------------------

    const amount = taxableAmount + taxAmount;

    subtotal += grossAmount;

    totalDiscount += discountAmount;

    totalTax += taxAmount;

    return {
      ...item,

      quantity,
      rate,
      discount,
      tax,

      amount: Number(amount.toFixed(2)),
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
// POST /api/Quotation
// CREATE NEW QUOTATION
// ============================================================

router.post("/", async (req, res) => {
  try {
    const {
      quotationDate,
      validUntil,

      customerId,
      customerName,
      companyName,
      customerEmail,
      customerPhone,

      billingAddress,
      shippingAddress,
      gstin,

      items,

      status,

      notes,
      termsAndConditions,

      createdBy,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one quotation item is required.",
      });
    }

    // ------------------------------------------
    // CALCULATE TOTAL
    // ------------------------------------------

    const totals = calculateTotals(items);

    // ------------------------------------------
    // GENERATE QUOTATION NUMBER
    // ------------------------------------------

    const quotationNumber = await generateQuotationNumber();

    // ------------------------------------------
    // CREATE QUOTATION
    // ------------------------------------------

    const quotation = new Quotation({
      quotationNumber,

      quotationDate: quotationDate || new Date(),

      validUntil,

      customerId: customerId || null,

      customerName,

      companyName: companyName || "",

      customerEmail: customerEmail || "",

      customerPhone: customerPhone || "",

      billingAddress: billingAddress || "",

      shippingAddress: shippingAddress || "",

      gstin: gstin || "",

      items: totals.items,

      subtotal: totals.subtotal,

      totalDiscount: totals.totalDiscount,

      totalTax: totals.totalTax,

      grandTotal: totals.grandTotal,

      status: status || "Draft",

      notes: notes || "",

      termsAndConditions: termsAndConditions || "",

      createdBy: createdBy || "",
    });

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    const savedQuotation = await quotation.save();

    return res.status(201).json({
      success: true,

      message: "Quotation created successfully.",

      data: savedQuotation,
    });
  } catch (error) {
    console.error("Create Quotation Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create quotation.",

      error: error.message,
    });
  }
});

// ============================================================
// GET /api/Quotation
// GET ALL QUOTATIONS
// ============================================================

router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      count: quotations.length,

      data: quotations,
    });
  } catch (error) {
    console.error("Get Quotations Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch quotations.",

      error: error.message,
    });
  }
});

// ============================================================
// GET /api/Quotation/customer/:customerId
// CUSTOMER-WISE QUOTATIONS
// ============================================================

router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!isValidId(customerId)) {
      return res.status(400).json({
        success: false,

        message: "Invalid customer ID.",
      });
    }

    const quotations = await Quotation.find({
      customerId: customerId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      count: quotations.length,

      data: quotations,
    });
  } catch (error) {
    console.error("Customer Quotations Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch customer quotations.",

      error: error.message,
    });
  }
});

// ============================================================
// GET /api/Quotation/:id
// GET SINGLE QUOTATION
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid quotation ID.",
      });
    }

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,

        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: quotation,
    });
  } catch (error) {
    console.error("Get Quotation Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch quotation.",

      error: error.message,
    });
  }
});

// ============================================================
// PUT /api/Quotation/:id
// UPDATE QUOTATION
// ============================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid quotation ID.",
      });
    }

    const existingQuotation = await Quotation.findById(id);

    if (!existingQuotation) {
      return res.status(404).json({
        success: false,

        message: "Quotation not found.",
      });
    }

    const {
      quotationDate,
      validUntil,

      customerId,
      customerName,
      companyName,
      customerEmail,
      customerPhone,

      billingAddress,
      shippingAddress,
      gstin,

      items,

      status,

      notes,
      termsAndConditions,

      createdBy,
    } = req.body;

    // ------------------------------------------
    // ITEMS
    // ------------------------------------------

    let calculatedTotals = null;

    if (Array.isArray(items)) {
      if (items.length === 0) {
        return res.status(400).json({
          success: false,

          message: "At least one quotation item is required.",
        });
      }

      calculatedTotals = calculateTotals(items);
    }

    // ------------------------------------------
    // UPDATE FIELDS
    // ------------------------------------------

    if (quotationDate !== undefined) {
      existingQuotation.quotationDate = quotationDate;
    }

    if (validUntil !== undefined) {
      existingQuotation.validUntil = validUntil;
    }

    if (customerId !== undefined) {
      existingQuotation.customerId = customerId || null;
    }

    if (customerName !== undefined) {
      existingQuotation.customerName = customerName;
    }

    if (companyName !== undefined) {
      existingQuotation.companyName = companyName;
    }

    if (customerEmail !== undefined) {
      existingQuotation.customerEmail = customerEmail;
    }

    if (customerPhone !== undefined) {
      existingQuotation.customerPhone = customerPhone;
    }

    if (billingAddress !== undefined) {
      existingQuotation.billingAddress = billingAddress;
    }

    if (shippingAddress !== undefined) {
      existingQuotation.shippingAddress = shippingAddress;
    }

    if (gstin !== undefined) {
      existingQuotation.gstin = gstin;
    }

    // ------------------------------------------
    // UPDATE ITEMS + TOTALS
    // ------------------------------------------

    if (calculatedTotals) {
      existingQuotation.items = calculatedTotals.items;

      existingQuotation.subtotal = calculatedTotals.subtotal;

      existingQuotation.totalDiscount = calculatedTotals.totalDiscount;

      existingQuotation.totalTax = calculatedTotals.totalTax;

      existingQuotation.grandTotal = calculatedTotals.grandTotal;
    }

    if (status !== undefined) {
      existingQuotation.status = status;
    }

    if (notes !== undefined) {
      existingQuotation.notes = notes;
    }

    if (termsAndConditions !== undefined) {
      existingQuotation.termsAndConditions = termsAndConditions;
    }

    if (createdBy !== undefined) {
      existingQuotation.createdBy = createdBy;
    }

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    const updatedQuotation = await existingQuotation.save();

    return res.status(200).json({
      success: true,

      message: "Quotation updated successfully.",

      data: updatedQuotation,
    });
  } catch (error) {
    console.error("Update Quotation Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update quotation.",

      error: error.message,
    });
  }
});

// ============================================================
// PUT /api/Quotation/:id/status
// UPDATE QUOTATION STATUS
// ============================================================

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid quotation ID.",
      });
    }

    const allowedStatuses = [
      "Draft",
      "Sent",
      "Accepted",
      "Rejected",
      "Expired",
      "Converted",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,

        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(
          ", ",
        )}`,
      });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      id,

      {
        status,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,

        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Quotation status updated successfully.",

      data: quotation,
    });
  } catch (error) {
    console.error("Update Quotation Status Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update quotation status.",

      error: error.message,
    });
  }
});

// ============================================================
// DELETE /api/Quotation/:id
// DELETE QUOTATION
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid quotation ID.",
      });
    }

    const quotation = await Quotation.findByIdAndDelete(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,

        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Quotation deleted successfully.",

      data: {
        id: quotation._id,
        quotationNumber: quotation.quotationNumber,
      },
    });
  } catch (error) {
    console.error("Delete Quotation Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete quotation.",

      error: error.message,
    });
  }
});

// ============================================================
// EXPORT
// ============================================================

module.exports = router;

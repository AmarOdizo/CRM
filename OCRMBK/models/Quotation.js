const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  },
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    quotationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    // ============================================
    // CUSTOMER DETAILS
    // ============================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },

    billingAddress: {
      type: String,
      trim: true,
      default: "",
    },

    shippingAddress: {
      type: String,
      trim: true,
      default: "",
    },

    gstin: {
      type: String,
      trim: true,
      default: "",
    },

    // ============================================
    // ITEMS
    // ============================================

    items: {
      type: [quotationItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "At least one quotation item is required.",
      },
    },

    // ============================================
    // AMOUNT DETAILS
    // ============================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalTax: {
      type: Number,
      min: 0,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ============================================
    // STATUS
    // ============================================

    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected", "Expired", "Converted"],
      default: "Draft",
    },

    // ============================================
    // TERMS / NOTES
    // ============================================

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    termsAndConditions: {
      type: String,
      trim: true,
      default: "",
    },

    // ============================================
    // CREATED BY
    // ============================================

    createdBy: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// ================================================
// INDEX
// ================================================

quotationSchema.index({
  customerName: 1,
});

quotationSchema.index({
  status: 1,
});

quotationSchema.index({
  quotationDate: -1,
});

// ================================================
// MODEL
// ================================================

const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation;

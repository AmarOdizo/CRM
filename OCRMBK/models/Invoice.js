const mongoose = require("mongoose");
const InvoiceCounter = require("./InvoiceCounter");

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
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

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      index: true,
    },

    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    // =========================
    // CLIENT DETAILS
    // =========================

    clientName: {
      type: String,
      required: true,
      trim: true,
    },
 
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },

    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    clientPhone: {
      type: String,
      trim: true,
    },

    clientAddress: {
      type: String,
      trim: true,
    },

    // =========================
    // ITEMS
    // =========================

    items: {
      type: [invoiceItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Invoice must contain at least one item.",
      },
    },

    // =========================
    // AMOUNT
    // =========================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================
    // PAYMENT
    // =========================

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid", "Overdue", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "UPI", "Card", "Cheque", "Other"],
      default: "Other",
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================
    // NOTES
    // =========================

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// AUTO GENERATE INVOICE NUMBER
// ==========================================

invoiceSchema.pre("save", async function () {
  if (!this.isNew || this.invoiceNumber) {
    return;
  }

  const counter = await InvoiceCounter.findOneAndUpdate(
    {
      _id: "invoice",
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  this.invoiceNumber = `INV-${String(counter.sequence).padStart(5, "0")}`;
});

module.exports = mongoose.model("Invoice", invoiceSchema);

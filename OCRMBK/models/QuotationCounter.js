const mongoose = require("mongoose");

// ==================================================
// SCHEMA
// ==================================================

const quotationCounterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },

    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ==================================================
// MODEL
// ==================================================

const QuotationCounter = mongoose.model(
  "QuotationCounter",
  quotationCounterSchema,
);

// ==================================================
// GENERATE QUOTATION NUMBER
// ==================================================

const generateQuotationNumber = async () => {
  const currentYear = new Date().getFullYear();

  const counter = await QuotationCounter.findOneAndUpdate(
    {
      year: currentYear,
    },

    {
      $inc: {
        sequence: 1,
      },
    },

    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  const quotationNumber = `QTN-${currentYear}-${String(
    counter.sequence,
  ).padStart(4, "0")}`;

  return quotationNumber;
};

// ==================================================
// EXPORT
// ==================================================

module.exports = {
  QuotationCounter,
  generateQuotationNumber,
};

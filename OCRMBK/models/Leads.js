const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    businessRequirement: {
      type: String,
      required: true,
    },
    leadSource: {
      type: String,
      required: true,
    },
    estimatedBudget: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    followUpDate: {
      type: String,
      required: true,
    },
    assignedEmployee: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Leads",
    timestamps: true,
  },
);

module.exports = mongoose.model("Leads", LeadSchema);

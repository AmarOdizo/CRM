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
      default: null,
    },
    clientName: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    businessRequirement: {
      type: String,
      default: "",
    },
    leadSource: {
      type: String,
      default: "",
    },
    estimatedBudget: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "New",
    },
    followUpDate: {
      type: String,
      default: "",
    },
    assignedEmployee: {
      type: String,
      default: "",
    },
    assignedEmployeeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    collection: "Leads",
    timestamps: true,
  },
);

module.exports = mongoose.model("Leads", LeadSchema);

const mongoose = require("mongoose");
const ClientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
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
    phone: { type: String, required: true },
    alternatePhone: { type: String, required: true },
    gstNumber: { type: String, required: true },
    website: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    industry: { type: String, required: true },
    clientType: { type: String, required: true },
    status: { type: String, required: true },
    assignedEmployee: { type: String, required: true },
    notes: { type: String, required: true },
  },

  {
    collection: "Client",
    timestamps: true,
  },
);

module.exports = mongoose.model("Client", ClientSchema);

const mongoose = require("mongoose");

const ClientCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "ClientCounter",
  }
);

module.exports = mongoose.model("ClientCounter", ClientCounterSchema);

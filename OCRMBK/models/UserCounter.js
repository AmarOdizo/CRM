const mongoose = require("mongoose");

const UserCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("UserCounter", UserCounterSchema);

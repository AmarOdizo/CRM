const mongoose = require("mongoose");

const ProjectCounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ProjectCounter", ProjectCounterSchema);

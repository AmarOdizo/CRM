const mongoose = require("mongoose");

const taskCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    sequenceValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const TaskCounter = mongoose.model("TaskCounter", taskCounterSchema);

module.exports = TaskCounter;

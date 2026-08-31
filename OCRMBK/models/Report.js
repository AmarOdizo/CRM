const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportName: {
      type: String,
      required: true,
      trim: true,
    },

    reportType: {
      type: String,
      required: true,
      enum: [
        "Lead Report",
        "Client Report",
        "Employee Report",
        "Project Report",
        "Revenue Report",
        "Task Report",
        "Attendance Report",
      ],
    },

    generatedBy: {
      type: String,
      required: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    totalRecords: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Generated", "Failed"],
      default: "Pending",
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    preview: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["CSV", "PDF", "EXCEL", ""],
      default: "",
    },

    generatedTime: {
      type: String,
      default: "",
    },
  },
  {
    collection: "Report",
    timestamps: true,
  },
);

module.exports = mongoose.model("Report", reportSchema);

const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectCode: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    projectManager: {
      type: String,
      required: true,
    },
    projectManagerRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    teamMembers: {
      type: [String],
      required: true,
    },
    teamMembersRefs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    technologyStack: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Project",
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", ProjectSchema);

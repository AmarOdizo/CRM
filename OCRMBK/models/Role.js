const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    roleCode: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Role",
    timestamps: true,
  },
);

module.exports = mongoose.model("Role", RoleSchema);

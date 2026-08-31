const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    employeeId: {
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

    department: {
      type: String,
    },

    designation: {
      type: String,
    },
    role: {
      type: String,
    },
    roleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    status: {
      type: String,
    },
    joiningDate: {
      type: String,
    },
    address: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    collection: "User",
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    adminid: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },
    adminrole: {
      type: String,
      required: true,
    },
    roleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    department: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    // OTP Store Karne Ke Liye
    otp: {
      type: String,
      default: null,
    },

    // OTP Expire Time
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "Admin",
    timestamps: true,
  },
);

module.exports = mongoose.model("Admin", AdminSchema);

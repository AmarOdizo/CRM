const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    employeeid: {
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
      unique: true,
    },

    department: {
      type: String,
    },

    designation: {
      type: String,
    },

    password: {
      type: String,
      required: true,
      // unique hata do
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
    collection: "Employee",
    timestamps: true,
  },
);

module.exports = mongoose.model("Employee", EmployeeSchema);

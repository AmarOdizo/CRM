const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");

// =======================
// GET ALL ADMIN
// =======================

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// POST ADMIN
// =======================

router.post("/", async (req, res) => {
  try {
    const admins = await Admin.create(req.body);

    res.status(201).json({
      success: true,
      message: "Employee Added Successfully",

      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// UPDATE ADMIN
// =======================

router.put("/phone/:phone", async (req, res) => {
  try {
    const admin = await Admin.findOneAndUpdate(
      { phone: req.params.phone }, // Find by phone
      req.body, // Update data
      { new: true, runValidators: true },
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Admin Login API
// ======================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find Admin by Email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check Password
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login Successful",
      admin: {
        id: admin._id,
        name: admin.name,
        adminid: admin.adminid,
        email: admin.email,
        phone: admin.phone,
        adminrole: admin.adminrole,
        department: admin.department,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// API Send-Otp //

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    // Database me Admin check karo
    const admin = await Admin.findOne({ phone });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Invalid Phone Number",
      });
    }

    // OTP Generate
    storedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Database me OTP Save

    console.log("OTP:", storedOtp);

    // Yahan SMS API se OTP send karna hai

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// API Verify Otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;

    if (otp === storedOtp) {
      return res.json({
        success: true,
        message: "OTP Verified",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// API Reset password
router.put("/reset-password", async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    const admin = await Admin.findOne({ phone });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;

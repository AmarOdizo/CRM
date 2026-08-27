const express = require("express");
const router = express.Router();

const Employee = require("../models/Employee");

// =======================
// GET ALL EMPLOYEES
// =======================

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// POST EMPLOYEE
// =======================

router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: "Employee Added Successfully",

      data: employee,
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
    const employee = await Employee.findOneAndUpdate(
      { phone: req.params.phone }, // Find by phone
      req.body, // Update data
      { new: true, runValidators: true },
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: Employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// Employee Login API
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

    // Find Employee by Email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check Password
    if (employee.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Login Success
    res.status(200).json({
      success: true,
      message: "Login Successful",
      employee: {
        id: employee._id,
        name: employee.name,
        employeeid: employee.employeeid,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        designation: employee.designation,
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
//
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    const employee = await Employee.findOne({ phone });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Invalid Phone Number",
      });
    }

    // OTP Generate
    storedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("OTP:", storedOtp);

    // SMS API se OTP send karo

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
//
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  if (otp === storedOtp) {
    storedOtp = ""; // OTP clear kar do

    return res.json({
      success: true,
      message: "OTP Verified",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
});
//
router.put("/reset-password", async (req, res) => {
  try {
    const { phone, newPassword } = req.body;
    const employee = await Employee.findOne({ phone });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Invalid Phone Number",
      });
    }
    employee.password = newPassword;
    await employee.save();

    res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

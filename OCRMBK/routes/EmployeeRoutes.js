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
// CHANGE PASSWORD API
// =======================

router.put("/change-password", async (req, res) => {
  try {
    const { id, email, oldPassword, newPassword } = req.body;

    if ((!id && !email) || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Employee ID/Email, Old Password, and New Password are required",
      });
    }

    // Find Employee by ID or Email
    let employee = null;
    if (id) {
      employee = await Employee.findById(id).catch(() => null);
    }
    if (!employee && email) {
      employee = await Employee.findOne({ email });
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if Old Password matches stored password
    if (employee.password !== oldPassword) {
      return res.status(400).json({
        success: false,
        isOldPasswordInvalid: true,
        message: "not old password please old password correct fill",
      });
    }

    // Save New Password into Employee table (overwriting old password)
    employee.password = newPassword;
    await employee.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully in Employee Table",
      data: employee,
    });
  } catch (error) {
    console.error("Change password route error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

// =======================
// GET SINGLE EMPLOYEE BY ID
// =======================

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    res.status(200).json({
      success: true,
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
// UPDATE EMPLOYEE BY ID
// =======================

router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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
// UPDATE BY PHONE
// =======================

router.put("/phone/:phone", async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { phone: req.params.phone },
      req.body,
      { new: true, runValidators: true }
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
      data: employee,
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

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
        password: employee.password,
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

let storedOtp = "";

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

    storedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP:", storedOtp);

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

router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  if (otp === storedOtp) {
    storedOtp = "";

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

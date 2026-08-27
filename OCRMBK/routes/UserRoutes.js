const express = require("express");
const router = express.Router();

const User = require("../models/User");
const UserCounter = require("../models/UserCounter");
const { resolveRoleRef } = require("../config/relationResolver");

// GET All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("roleRef").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// GET User By MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) }).populate("roleRef");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// POST Create User

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      employeeId,
      email,
      phone,
      department,
      designation,
      role,
      status,
      joiningDate,
      address,
      profileImage,
      notes,
    } = req.body;

    // Required Validation
    if (!fullName || !employeeId || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Employee ID Check
    const employeeExists = await User.findOne({ employeeId });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    // Email Check
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Auto Increment ID
    const counter = await UserCounter.findByIdAndUpdate(
      "userId",
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    // Create User
    const user = await User.create({
      id: counter.seq,
      fullName,
      employeeId,
      email,
      phone,
      department,
      designation,
      role,
      roleRef: await resolveRoleRef(role),
      status,
      joiningDate,
      address,
      profileImage,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =======================
// UPDATE User
// =======================

router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.role !== undefined) {
      req.body.roleRef = await resolveRoleRef(req.body.role);
    }
    const user = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// DELETE User
// =======================

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Role = require("../models/Role");
const RoleCounter = require("../models/RoleCounter");

// Get All Roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
});

// Get Single Role By ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findOne({
      id: Number(req.params.id),
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch role",
      error: error.message,
    });
  }
});

// Create Role
router.post("/", async (req, res) => {
  try {
    const { roleName, roleCode, department, description, permissions, status } =
      req.body;

    // Check duplicate Role Code
    const existingRole = await Role.findOne({ roleCode });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role Code already exists",
      });
    }

    // Auto Increment ID
    const counter = await RoleCounter.findByIdAndUpdate(
      { _id: "roleId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    // Create Role
    const role = new Role({
      id: counter.seq,
      roleName,
      roleCode,
      department,
      description,
      permissions,
      status,
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message,
    });
  }
});
// Update Role
router.put("/:id", async (req, res) => {
  try {
    const { roleName, roleCode, department, description, permissions, status } =
      req.body;

    // Check if role exists
    const role = await Role.findOne({ id: Number(req.params.id) });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check duplicate roleCode
    const existingRole = await Role.findOne({
      roleCode,
      id: { $ne: Number(req.params.id) },
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role Code already exists",
      });
    }

    // Update Role
    role.roleName = roleName;
    role.roleCode = roleCode;
    role.department = department;
    role.description = description;
    role.permissions = permissions;
    role.status = status;

    await role.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    });
  }
});
// Delete Role
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
      error: error.message,
    });
  }
});

module.exports = router;

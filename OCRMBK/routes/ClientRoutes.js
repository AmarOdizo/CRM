const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Client = require("../models/Client");
const ClientCounter = require("../models/ClientCounter");
const { resolveUserRef } = require("../config/relationResolver");

// Helper function to build flexible lookup query for Client
const getClientQuery = (paramId) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
  if (isObjectId) {
    return {
      $or: [
        { _id: paramId },
        { id: paramId },
        { id: String(paramId) },
        { id: Number(paramId) || paramId },
      ],
    };
  }
  return {
    $or: [
      { id: paramId },
      { id: String(paramId) },
      { id: Number(paramId) || paramId },
    ],
  };
};

// =======================
// GET ALL Clients
// =======================
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("assignedEmployeeRef")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// GET Single Client By ID / Custom ID
// =======================
router.get("/:id", async (req, res) => {
  try {
    const query = getClientQuery(req.params.id);
    const client = await Client.findOne(query).populate("assignedEmployeeRef");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// POST Client
// =======================
router.post("/", async (req, res) => {
  try {
    const {
      clientName,
      companyName,
      email,
      phone,
      alternatePhone,
      gstNumber,
      website,
      address,
      city,
      state,
      country,
      pincode,
      industry,
      clientType,
      status,
      assignedEmployee,
      notes,
    } = req.body;

    // Required Validation
    if (!clientName || !companyName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Client Name, Company Name, Email and Phone are required",
      });
    }

    // Email Check
    const emailExists = await Client.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Auto Increment ID using ClientCounter collection
    const counter = await ClientCounter.findByIdAndUpdate(
      "clientId",
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    // Create Client
    const client = await Client.create({
      id: String(counter.seq),
      clientName,
      companyName,
      email,
      phone,
      alternatePhone,
      gstNumber,
      website,
      address,
      city,
      state,
      country,
      pincode,
      industry,
      clientType,
      status,
      assignedEmployee,
      assignedEmployeeRef: await resolveUserRef(assignedEmployee),
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Client Added Successfully",
      data: client,
    });
  } catch (error) {
    console.error("Error creating client:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// UPDATE Client
// =======================
router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.assignedEmployee !== undefined) {
      req.body.assignedEmployeeRef = await resolveUserRef(req.body.assignedEmployee);
    }

    const query = getClientQuery(req.params.id);
    const client = await Client.findOneAndUpdate(
      query,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client Updated Successfully",
      data: client,
    });
  } catch (error) {
    console.error("Error updating client:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// DELETE Client
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const query = getClientQuery(req.params.id);
    const client = await Client.findOneAndDelete(query);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client Deleted Successfully",
      data: client,
    });
  } catch (error) {
    console.error("Error deleting client:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

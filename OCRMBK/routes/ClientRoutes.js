const express = require("express");
const router = express.Router();

const Client = require("../models/Client");
const ClientCounter = require("../models/ClientCounter");

// =======================
// GET ALL Clients
// =======================
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// GET Single Client By Custom ID
// =======================
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findOne({
      id: Number(req.params.id),
    });

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
    console.error(error);

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

    // Auto Increment ID
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
      id: counter.seq,
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
    });

    res.status(201).json({
      success: true,
      message: "Client Added Successfully",
      data: client,
    });
  } catch (error) {
    console.error(error);

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
    const client = await Client.findOneAndUpdate(
      { id: Number(req.params.id) },
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
    console.error(error);

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
    const client = await Client.findOneAndDelete({
      id: Number(req.params.id),
    });

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
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

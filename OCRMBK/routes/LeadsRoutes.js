const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Leads = require("../models/Leads");
const Counter = require("../models/Counter");
const Client = require("../models/Client");
const { resolveUserRef } = require("../config/relationResolver");

// Helper function to build flexible lookup query for Lead
const getLeadQuery = (paramId) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
  if (isObjectId) {
    return {
      $or: [
        { _id: paramId },
        { id: paramId },
        { id: Number(paramId) || paramId },
      ],
    };
  }
  return {
    $or: [
      { id: paramId },
      { id: Number(paramId) || paramId },
    ],
  };
};

// =======================
// GET ALL Leads
// =======================
router.get("/", async (req, res) => {
  try {
    const leads = await Leads.find()
      .populate("client", "clientName")
      .populate("assignedEmployeeRef")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// GET Single Lead
// =======================
router.get("/:id", async (req, res) => {
  try {
    const query = getLeadQuery(req.params.id);
    const lead = await Leads.findOne(query)
      .populate("client", "clientName")
      .populate("assignedEmployeeRef");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Error fetching single lead:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// POST Lead
// =======================
router.post("/", async (req, res) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      "leadId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    req.body.id = counter.seq;

    if (req.body.assignedEmployee) {
      req.body.assignedEmployeeRef = await resolveUserRef(req.body.assignedEmployee);
    }

    // Safely verify client if provided, otherwise leave null
    if (req.body.client) {
      const isObjectId = mongoose.Types.ObjectId.isValid(req.body.client);
      let foundClient = null;
      if (isObjectId) {
        foundClient = await Client.findById(req.body.client);
      } else {
        foundClient = await Client.findOne({
          $or: [
            { id: req.body.client },
            { id: String(req.body.client) },
            { id: Number(req.body.client) || req.body.client },
          ],
        });
      }

      if (foundClient) {
        req.body.client = foundClient._id;
      } else {
        delete req.body.client;
      }
    } else {
      delete req.body.client;
    }

    const lead = await Leads.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lead Added Successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// UPDATE Lead
// =======================
router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.assignedEmployee !== undefined) {
      req.body.assignedEmployeeRef = await resolveUserRef(req.body.assignedEmployee);
    }

    if (req.body.client) {
      const isObjectId = mongoose.Types.ObjectId.isValid(req.body.client);
      let foundClient = null;
      if (isObjectId) {
        foundClient = await Client.findById(req.body.client);
      } else {
        foundClient = await Client.findOne({
          $or: [
            { id: req.body.client },
            { id: String(req.body.client) },
            { id: Number(req.body.client) || req.body.client },
          ],
        });
      }

      if (foundClient) {
        req.body.client = foundClient._id;
      } else {
        delete req.body.client;
      }
    } else if (req.body.client === "" || req.body.client === null) {
      req.body.client = null;
    }

    const query = getLeadQuery(req.params.id);
    const lead = await Leads.findOneAndUpdate(
      query,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("client", "clientName")
      .populate("assignedEmployeeRef");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead Updated Successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// DELETE Lead
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const query = getLeadQuery(req.params.id);
    const lead = await Leads.findOneAndDelete(query);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead Deleted Successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

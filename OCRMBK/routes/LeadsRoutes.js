const express = require("express");
const router = express.Router();

const Leads = require("../models/Leads");
const Counter = require("../models/Counter");
const Client = require("../models/Client");
const { resolveUserRef } = require("../config/relationResolver");

// =======================
// GET ALL Leads
// =======================

router.get("/", async (req, res) => {
  try {
    const leads = await Leads.find().populate("client", "clientName").populate("assignedEmployeeRef");

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// GET Single Leads
// =======================

router.get("/:id", async (req, res) => {
  try {
    const lead = await Leads.findOne({
      id: Number(req.params.id),
    }).populate("client", "clientName").populate("assignedEmployeeRef");

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

    // Client exists or not
    const client = await Client.findById(req.body.client);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const lead = await Leads.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lead Added Successfully",
      data: lead,
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
// UPDATE Lead
// =======================

router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.assignedEmployee !== undefined) {
      req.body.assignedEmployeeRef = await resolveUserRef(req.body.assignedEmployee);
    }
    // Agar client update ho raha hai to verify karo
    if (req.body.client) {
      const client = await Client.findById(req.body.client);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client Not Found",
        });
      }
    }

    const lead = await Leads.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("client", "clientName").populate("assignedEmployeeRef");

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =======================
// DELETE Lead by Custom ID
// =======================

router.delete("/:id", async (req, res) => {
  try {
    const lead = await Leads.findOneAndDelete({
      id: Number(req.params.id),
    });

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;

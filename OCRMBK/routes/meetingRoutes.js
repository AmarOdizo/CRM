const express = require("express");
const Meeting = require("../models/Meeting");

const router = express.Router();

// ======================================================
// POST /api/Meeting
// CREATE MEETING
// ======================================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      clientId,
      projectId,
      meetingDate,
      startTime,
      endTime,
      meetingType,
      meetingLink,
      location,
      participants,
      status,
      notes,
    } = req.body;

    // -----------------------------
    // REQUIRED VALIDATION
    // -----------------------------

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meeting title is required",
      });
    }

    if (!meetingDate) {
      return res.status(400).json({
        success: false,
        message: "Meeting date is required",
      });
    }

    if (!startTime) {
      return res.status(400).json({
        success: false,
        message: "Start time is required",
      });
    }

    if (!endTime) {
      return res.status(400).json({
        success: false,
        message: "End time is required",
      });
    }

    // -----------------------------
    // CREATE MEETING
    // -----------------------------

    const meeting = new Meeting({
      title: title.trim(),

      description: description?.trim() || "",

      clientId: clientId || undefined,

      projectId: projectId || undefined,

      meetingDate,

      startTime,

      endTime,

      meetingType: meetingType || "Online",

      meetingLink: meetingLink?.trim() || "",

      location: location?.trim() || "",

      participants: Array.isArray(participants) ? participants : [],

      status: status || "Scheduled",

      notes: notes?.trim() || "",
    });

    const savedMeeting = await meeting.save();

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      data: savedMeeting,
    });
  } catch (error) {
    console.error("Create Meeting Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule meeting",
      error: error.message,
    });
  }
});

// ======================================================
// GET /api/Meeting
// GET ALL MEETINGS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("clientId", "clientName")
      .populate("projectId", "projectName")
      .sort({
        meetingDate: 1,
        startTime: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Get Meetings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: error.message,
    });
  }
});

// ======================================================
// GET /api/Meeting/:id
// GET SINGLE MEETING
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("clientId", "clientName")
      .populate("projectId", "projectName")
      .lean();

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error("Get Meeting Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
      error: error.message,
    });
  }
});

// ======================================================
// GET /api/Meeting/client/:clientId
// GET CLIENT MEETINGS
// ======================================================

router.get("/client/:clientId", async (req, res) => {
  try {
    const meetings = await Meeting.find({
      clientId: req.params.clientId,
    })
      .sort({
        meetingDate: 1,
        startTime: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Client Meetings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch client meetings",
      error: error.message,
    });
  }
});

// ======================================================
// GET /api/Meeting/project/:projectId
// GET PROJECT MEETINGS
// ======================================================

router.get("/project/:projectId", async (req, res) => {
  try {
    const meetings = await Meeting.find({
      projectId: req.params.projectId,
    })
      .sort({
        meetingDate: 1,
        startTime: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error("Project Meetings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project meetings",
      error: error.message,
    });
  }
});

// ======================================================
// PUT /api/Meeting/:id
// UPDATE MEETING
// ======================================================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      clientId,
      projectId,
      meetingDate,
      startTime,
      endTime,
      meetingType,
      meetingLink,
      location,
      participants,
      status,
      notes,
    } = req.body;

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (clientId !== undefined) {
      updateData.clientId = clientId || undefined;
    }

    if (projectId !== undefined) {
      updateData.projectId = projectId || undefined;
    }

    if (meetingDate !== undefined) {
      updateData.meetingDate = meetingDate;
    }

    if (startTime !== undefined) {
      updateData.startTime = startTime;
    }

    if (endTime !== undefined) {
      updateData.endTime = endTime;
    }

    if (meetingType !== undefined) {
      updateData.meetingType = meetingType;
    }

    if (meetingLink !== undefined) {
      updateData.meetingLink = meetingLink.trim();
    }

    if (location !== undefined) {
      updateData.location = location.trim();
    }

    if (participants !== undefined) {
      updateData.participants = Array.isArray(participants) ? participants : [];
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes.trim();
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error("Update Meeting Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update meeting",
      error: error.message,
    });
  }
});

// ======================================================
// DELETE /api/Meeting/:id
// DELETE MEETING
// ======================================================

router.delete("/:id", async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!deletedMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data: deletedMeeting,
    });
  } catch (error) {
    console.error("Delete Meeting Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
});

module.exports = router;

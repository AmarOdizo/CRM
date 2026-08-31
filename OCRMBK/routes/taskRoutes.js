const express = require("express");
const mongoose = require("mongoose");

const Task = require("../models/Task");
const TaskCounter = require("../models/TaskCounter");
const User = require("../models/User");
const Employee = require("../models/Employee");

const router = express.Router();

// =====================================================
// GET NEXT TASK NUMBER
// =====================================================

const getNextTaskNumber = async () => {
  const counter = await TaskCounter.findOneAndUpdate(
    { name: "task" },
    { $inc: { sequenceValue: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return counter.sequenceValue;
};

// Helper function to get valid user ObjectId
const resolveUserObjectId = async (val, defaultSearchRole = null) => {
  if (val && mongoose.Types.ObjectId.isValid(val)) {
    return val;
  }
  try {
    if (val && typeof val === "string") {
      const matchByName = await User.findOne({
        fullName: new RegExp(val.trim(), "i"),
      }) || await Employee.findOne({
        name: new RegExp(val.trim(), "i"),
      });
      if (matchByName) return matchByName._id;
    }

    if (defaultSearchRole) {
      const roleUser = await User.findOne({ role: defaultSearchRole });
      if (roleUser) return roleUser._id;
    }

    const firstUser = await User.findOne();
    if (firstUser) return firstUser._id;

    return new mongoose.Types.ObjectId();
  } catch (e) {
    return new mongoose.Types.ObjectId();
  }
};

// Helper to resolve display name for user
const resolveUserName = async (userId, passedName) => {
  if (passedName && typeof passedName === "string" && passedName.trim()) {
    return passedName.trim();
  }
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const u = await User.findById(userId);
    if (u) return u.fullName || u.name || u.email;
    const emp = await Employee.findById(userId);
    if (emp) return emp.name || emp.fullName || emp.email;
  }
  return typeof userId === "string" ? userId : "";
};

// =====================================================
// POST - CREATE TASK
// =====================================================

router.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      assignedTo,
      assignedToName,
      assignedBy,
      assignedByName,
      projectId,
      projectName,
      priority,
      status,
      startDate,
      dueDate,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Set default dates if missing
    if (!startDate) startDate = new Date();
    if (!dueDate) dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Resolve valid ObjectIds for assignedTo and assignedBy
    const resolvedAssignedTo = await resolveUserObjectId(assignedTo);
    const resolvedAssignedBy = await resolveUserObjectId(assignedBy, "Admin");

    // Resolve string names for assignedTo and assignedBy
    const finalAssignedToName = await resolveUserName(resolvedAssignedTo, assignedToName || assignedTo);
    const finalAssignedByName = await resolveUserName(resolvedAssignedBy, assignedByName || assignedBy);

    // Generate Task Number
    const taskNumber = await getNextTaskNumber();

    // Create Task with explicit Name fields
    const task = await Task.create({
      taskNumber,
      title,
      description,
      assignedTo: resolvedAssignedTo,
      assignedToName: finalAssignedToName,
      assignedBy: resolvedAssignedBy,
      assignedByName: finalAssignedByName,
      projectId: projectId || "",
      projectName: projectName || "",
      priority: priority || "Medium",
      status: status || "Pending",
      startDate,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task: " + error.message,
      error: error.message,
    });
  }
});

// =====================================================
// GET - ALL TASKS
// =====================================================

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "fullName name email role designation")
      .populate("assignedBy", "fullName name email role designation")
      .sort({ createdAt: -1 });

    // Fallback populate & ensure assignedToName and assignedByName are populated
    for (let t of tasks) {
      if (t.assignedTo && typeof t.assignedTo === "object") {
        if (!t.assignedToName) {
          t.assignedToName = t.assignedTo.fullName || t.assignedTo.name || t.assignedTo.email || "";
        }
      }
      if (t.assignedBy && typeof t.assignedBy === "object") {
        if (!t.assignedByName) {
          t.assignedByName = t.assignedBy.fullName || t.assignedBy.name || t.assignedBy.email || "";
        }
      }
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// =====================================================
// GET - TASK BY ID
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id)
      .populate("assignedTo", "fullName name email role designation")
      .populate("assignedBy", "fullName name email role designation");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.assignedTo && typeof task.assignedTo === "object" && !task.assignedToName) {
      task.assignedToName = task.assignedTo.fullName || task.assignedTo.name || "";
    }
    if (task.assignedBy && typeof task.assignedBy === "object" && !task.assignedByName) {
      task.assignedByName = task.assignedBy.fullName || task.assignedBy.name || "";
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
});

// =====================================================
// PUT - UPDATE TASK
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const {
      title,
      description,
      assignedTo,
      assignedToName,
      assignedBy,
      assignedByName,
      projectId,
      projectName,
      priority,
      status,
      startDate,
      dueDate,
      completedAt,
    } = req.body;

    const updateData = {
      title,
      description,
      projectId,
      projectName,
      priority,
      status,
      startDate,
      dueDate,
      completedAt,
    };

    if (assignedTo) {
      updateData.assignedTo = await resolveUserObjectId(assignedTo);
      updateData.assignedToName = await resolveUserName(updateData.assignedTo, assignedToName || assignedTo);
    }
    if (assignedBy) {
      updateData.assignedBy = await resolveUserObjectId(assignedBy, "Admin");
      updateData.assignedByName = await resolveUserName(updateData.assignedBy, assignedByName || assignedBy);
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (status === "Completed" && !completedAt) {
      updateData.completedAt = new Date();
    }

    if (status && status !== "Completed") {
      updateData.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "fullName name email role designation")
      .populate("assignedBy", "fullName name email role designation");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE - DELETE TASK
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

module.exports = router;

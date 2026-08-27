const express = require("express");
const mongoose = require("mongoose");

const Task = require("../models/Task");
const TaskCounter = require("../models/TaskCounter");

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

// =====================================================
// POST - CREATE TASK
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      assignedBy,
      priority,
      status,
      startDate,
      dueDate,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !assignedTo ||
      !assignedBy ||
      !startDate ||
      !dueDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Generate Task Number
    const taskNumber = await getNextTaskNumber();

    // Create Task
    const task = await Task.create({
      taskNumber,
      title,
      description,
      assignedTo,
      assignedBy,
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
      message: "Failed to create task",
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
      .populate("assignedTo", "fullName email")
      .populate("assignedBy", "fullName email")
      .sort({ createdAt: -1 });

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

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id)
      .populate("assignedTo", "fullName email")
      .populate("assignedBy", "fullName email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
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
      assignedBy,
      priority,
      status,
      startDate,
      dueDate,
      completedAt,
    } = req.body;

    const updateData = {
      title,
      description,
      assignedTo,
      assignedBy,
      priority,
      status,
      startDate,
      dueDate,
      completedAt,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Automatically set completedAt
    if (status === "Completed" && !completedAt) {
      updateData.completedAt = new Date();
    }

    // If task is moved away from Completed
    if (status && status !== "Completed") {
      updateData.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "fullName email")
      .populate("assignedBy", "fullName email");

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

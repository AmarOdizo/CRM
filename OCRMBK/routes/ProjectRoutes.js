const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const ProjectCounter = require("../models/ProjectCounter");

// ==========================
// GET All Projects
// ==========================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

// ==========================
// GET Project By ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});
// ==========================
// POST Project
// ==========================
router.post("/", async (req, res) => {
  try {
    const {
      projectName,
      projectCode,
      clientName,
      projectManager,
      teamMembers,
      startDate,
      endDate,
      budget,
      priority,
      status,
      technologyStack,
      description,
    } = req.body;

    // Counter Generate
    let counter = await ProjectCounter.findOne({ id: "projectId" });

    if (!counter) {
      counter = await ProjectCounter.create({
        id: "projectId",
        seq: 1,
      });
    } else {
      counter.seq += 1;
      await counter.save();
    }

    const project = new Project({
      id: counter.seq.toString(),
      projectName,
      projectCode,
      clientName,
      projectManager,
      teamMembers,
      startDate,
      endDate,
      budget,
      priority,
      status,
      technologyStack,
      description,
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Create Project",
      error: error.message,
    });
  }
});

// ==========================
// UPDATE Project
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const {
      projectName,
      projectCode,
      clientName,
      projectManager,
      teamMembers,
      startDate,
      endDate,
      budget,
      priority,
      status,
      technologyStack,
      description,
    } = req.body;

    const project = await Project.findOne({ id: req.params.id });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Not Found",
      });
    }

    project.projectName = projectName;
    project.projectCode = projectCode;
    project.clientName = clientName;
    project.projectManager = projectManager;
    project.teamMembers = teamMembers;
    project.startDate = startDate;
    project.endDate = endDate;
    project.budget = budget;
    project.priority = priority;
    project.status = status;
    project.technologyStack = technologyStack;
    project.description = description;

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Update Project",
      error: error.message,
    });
  }
});

// ==========================
// DELETE Project
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      id: req.params.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Delete Project",
      error: error.message,
    });
  }
});

module.exports = router;

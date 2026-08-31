const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const ProjectCounter = require("../models/ProjectCounter");
const { resolveClientRef, resolveUserRef } = require("../config/relationResolver");

// ==========================
// GET All Projects
// ==========================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client")
      .populate("projectManagerRef")
      .populate("teamMembersRefs")
      .sort({ createdAt: -1 });

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
    const project = await Project.findOne({ id: req.params.id })
      .populate("client")
      .populate("projectManagerRef")
      .populate("teamMembersRefs");

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

    const clientRef = await resolveClientRef(clientName);
    const projectManagerRef = await resolveUserRef(projectManager);
    const membersList = Array.isArray(teamMembers) ? teamMembers : [];
    const teamMembersRefs = (await Promise.all(membersList.map(member => resolveUserRef(member)))).filter(Boolean);

    const project = new Project({
      id: counter.seq.toString(),
      projectName,
      projectCode,
      clientName,
      client: clientRef,
      projectManager,
      projectManagerRef,
      teamMembers,
      teamMembersRefs,
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

    if (projectName !== undefined) project.projectName = projectName;
    if (projectCode !== undefined) project.projectCode = projectCode;
    if (clientName !== undefined) {
      project.clientName = clientName;
      project.client = await resolveClientRef(clientName);
    }
    if (projectManager !== undefined) {
      project.projectManager = projectManager;
      project.projectManagerRef = await resolveUserRef(projectManager);
    }
    if (teamMembers !== undefined) {
      project.teamMembers = teamMembers;
      const membersList = Array.isArray(teamMembers) ? teamMembers : [];
      project.teamMembersRefs = (await Promise.all(membersList.map(member => resolveUserRef(member)))).filter(Boolean);
    }
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (budget !== undefined) project.budget = budget;
    if (priority !== undefined) project.priority = priority;
    if (status !== undefined) project.status = status;
    if (technologyStack !== undefined) project.technologyStack = technologyStack;
    if (description !== undefined) project.description = description;

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

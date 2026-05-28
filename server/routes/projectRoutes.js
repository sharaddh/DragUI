import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/auth.middleware.js";
import { generateCode } from "../utils/generateCode.js";
const router = express.Router();

function generateUniqueId(len = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// SAVE DESIGN
router.post("/save", auth, async (req, res) => {
  const { design, name } = req.body;

  const { isPublic } = req.body;

  let project = await Project.findOne({
    userId: req.userId,
    name,
  });

  if (project) {
    project.design = design;
    if (typeof isPublic === 'boolean') project.isPublic = isPublic;
    project.updatedAt = Date.now();
    await project.save();
  } else {
    const uniqueId = generateUniqueId(10);
    project = await Project.create({
      userId: req.userId,
      name,
      uniqueId,
      isPublic: !!isPublic,
      design,
    });
  }

  res.json(project);
});

// GET CURRENT USER'S PROJECT
router.get("/get", auth, async (req, res) => {
  const projects = await Project.find({ userId: req.userId });

  // return list of projects for the user
  res.json(projects);
});

// GET GENERATED CODE
router.get("/code", auth, async (req, res) => {
  const project = await Project.findOne({ userId: req.userId });
  if (!project) return res.status(404).json("No project");
  const code = generateCode(project.design);
  res.json({ code });
});

// GET PROJECT BY ID OR NAME (user-scoped)
router.get("/:idOrName", auth, async (req, res) => {
  const { idOrName } = req.params;
  let project;

  // Try to find by MongoDB ObjectId first
  if (idOrName.match(/^[0-9a-fA-F]{24}$/)) {
    project = await Project.findOne({ _id: idOrName, userId: req.userId });
  }

  // If not found by ID, try by name
  if (!project) {
    project = await Project.findOne({ name: idOrName, userId: req.userId });
  }

  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// PUBLIC GET BY uniqueId (no auth required)
router.get("/public/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const project = await Project.findOne({ uniqueId, isPublic: true });
  if (!project) return res.status(404).json({ error: "Public project not found" });
  res.json(project);
});

export default router;
import express from "express";
import Component from "../models/components.js";
import { upload } from "../middleware/upload.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// 🔥 Create Component with Code (New Format - Protected)
router.post(
  "/components/create",
  adminAuth,
  async (req, res) => {
    try {
      const { name, label, category, description, template, installSteps, props } = req.body;

      if (!name || !category) {
        return res.status(400).json({ message: "Name and category are required" });
      }

      const component = await Component.create({
        name,
        label: label || name,
        category,
        description: description || "",
        installSteps: installSteps || "",
        props: props || [],
        path: template || `${category}/${name}`,
      });

      res.status(201).json({
        message: "Component created successfully",
        component,
      });
    } catch (err) {
      console.error("Component creation error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 🔥 Upload Component (Protected) - Legacy format
router.post(
  "/component",
  adminAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const { name, type, category, props } = req.body;

      if (!name || !type || !category) {
        return res.status(400).json({ message: "Name, type, and category are required" });
      }

      const files = req.files ? req.files.map((f) => f.filename) : [];

      const component = await Component.create({
        name,
        type,
        category,
        path: `${type}/${name}`,
        props: props ? props.split(",").map(p => ({ name: p.trim() })) : [],
        files,
      });

      res.status(201).json({
        message: "Component created successfully",
        component,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get all components
router.get("/components", adminAuth, async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete component
router.delete("/component/:id", adminAuth, async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    res.json({ message: "Component deleted", component });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
import express from "express";
import Component from "../models/components.js";

const router = express.Router();

// Get ALL components (Used by the DragUI Frontend sidebar)
router.get("/all", async (req, res) => {
  try {
    const components = await Component.find().select("-__v"); // Exclude mongoose version key
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: "Error fetching components" });
  }
});

// Get a SPECIFIC component (Used by the CLI to pull code and assets)
router.get("/:name", async (req, res) => {
  try {
    const comp = await Component.findOne({ name: req.params.name });

    if (!comp) return res.status(404).json({ message: "Component not found" });

    // The CLI will consume this JSON. 
    // comp.code contains the raw JSX.
    // comp.files contains the Cloudinary URLs for assets.
    res.json(comp);
  } catch (err) {
    res.status(500).json({ message: "Error fetching component details" });
  }
});

export default router;
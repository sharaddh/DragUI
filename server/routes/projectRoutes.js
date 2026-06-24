import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Project from "../models/Project.js";
import * as projectController from "../controllers/projectController.js";

const router = express.Router();

router.get("/marketplace", async (req, res) => {
  const projects = await Project.find({
    isMarketplace: true,
    visibility: "public",
  });
  res.json({ success: true, projects });
});

router.post("/", authMiddleware, projectController.create);
router.get("/list", authMiddleware, projectController.list);
router.post("/save", authMiddleware, projectController.save);
router.get("/:projectId", projectController.getOne);
router.put("/:projectId", authMiddleware, projectController.update);
router.delete("/:projectId", authMiddleware, projectController.deleteProject);

export default router;
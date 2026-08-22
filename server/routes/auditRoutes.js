import express from "express";

import {
  getWorkspaceLogs,
} from "../services/auditService.js";

import authMiddleware
from "../middleware/auth.middleware.js";

import Workspace
from "../models/Workspace.js";

const router =
  express.Router();

// GET /api/audit/:workspaceId/logs?page=1&limit=50
// Members (or the owner) of a workspace may read its audit trail.
router.get(
  "/:workspaceId/logs",
  authMiddleware,
  async (req, res) => {
    try {
      const workspace =
        await Workspace.findById(
          req.params.workspaceId
        ).select("owner members.user");

      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      const isMember =
        String(workspace.owner) === String(req.userId) ||
        workspace.members.some(
          (m) => String(m.user?._id || m.user) === String(req.userId)
        );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Not a member of this workspace",
        });
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));

      const logs = await getWorkspaceLogs(
        req.params.workspaceId,
        page,
        limit
      );

      res.json({ success: true, logs });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;

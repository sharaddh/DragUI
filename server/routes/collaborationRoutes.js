import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import * as collaborationController
from "../controllers/collaborationController.js";

const router = express.Router();

router.get(
  "/:projectId/users",
  authMiddleware,
  collaborationController.getActiveUsers
);

export default router;
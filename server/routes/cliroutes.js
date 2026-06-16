import express from "express";
import * as cliController from "../controllers/cliController.js";

import adminAuth
from "../middleware/adminAuth.js";
const router = express.Router();

/*
GET /api/cli/pull/A4da7
*/
router.post(
 "/publish",
 adminAuth,
 cliController.publishPackage
);
router.get(
  "/pull/:projectId",
  cliController.pullProject
);

export default router;
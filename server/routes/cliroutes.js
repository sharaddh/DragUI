import express from "express";
import * as cliController from "../controllers/cliController.js";

const router = express.Router();

/*
GET /api/cli/pull/A4da7
*/

router.get(
  "/pull/:projectId",
  cliController.pullProject
);

export default router;
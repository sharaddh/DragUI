import express from "express";

import {
 createVersion
}
from "../controllers/versionController.js";

import adminAuth
from "../middleware/adminAuth.js";

const router =
 express.Router();

router.post(
 "/:id",
 adminAuth,
 createVersion
);

export default router;
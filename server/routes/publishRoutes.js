import express from "express";

import adminAuth
from "../middleware/adminAuth.js";

import * as publishController
from "../controllers/publishController.js";

const router =
 express.Router();

router.post(
 "/project/:id",
 adminAuth,
 publishController.publish
);

router.post(
 "/marketplace/:id",
 adminAuth,
 publishController.marketplace
);

export default router;
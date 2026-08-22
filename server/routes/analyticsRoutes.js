import express
from "express";

import {
 trackView
}
from "../controllers/analyticsController.js";

import authMiddleware
from "../middleware/auth.middleware.js";

const router =
 express.Router();

router.post(
 "/view/:id",
 authMiddleware,
 trackView
);

export default router;
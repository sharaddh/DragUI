import express from "express";
import rateLimit from "express-rate-limit";

import * as analyticsController
from "../controllers/componentAnalyticsController.js";

import authMiddleware
from "../middleware/auth.middleware.js";

// Throttle counter writes so view/download/install/like flooding is bounded.
// (Counter-flooding previously inflated trending/popularity.)
const counterLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const router =
 express.Router();

router.post(
 "/:id/view",
 authMiddleware,
 counterLimiter,
 analyticsController.addView
);

router.post(
 "/:id/download",
 authMiddleware,
 counterLimiter,
 analyticsController.addDownload
);

router.post(
 "/:id/install",
 authMiddleware,
 counterLimiter,
 analyticsController.addInstall
);

router.post(
 "/:id/like",
 authMiddleware,
 counterLimiter,
 analyticsController.addLike
);

router.get(
 "/:id",
 analyticsController.getAnalytics
);

router.get(
 "/trending/list",
 analyticsController.trending
);

export default router;
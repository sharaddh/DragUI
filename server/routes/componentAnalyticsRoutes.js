import express from "express";

import * as analyticsController
from "../controllers/componentAnalyticsController.js";

const router =
 express.Router();

router.post(
 "/:id/view",
 analyticsController.addView
);

router.post(
 "/:id/download",
 analyticsController.addDownload
);

router.post(
 "/:id/install",
 analyticsController.addInstall
);

router.post(
 "/:id/like",
 analyticsController.addLike
);

router.get(
 "/:id",
 analyticsController.getAnalytics
);

export default router;
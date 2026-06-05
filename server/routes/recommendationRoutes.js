import express from "express";

import * as recommendationController
from "../controllers/recommendationController.js";

const router =
  express.Router();

router.get(
  "/popular",
  recommendationController.popular
);

router.get(
  "/:id",
  recommendationController.recommendations
);

export default router;
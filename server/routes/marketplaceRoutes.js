import express from "express";

import * as marketplaceController
from "../controllers/marketplaceController.js";

const router =
 express.Router();

router.get(
 "/popular",
 marketplaceController.popular
);

export default router;
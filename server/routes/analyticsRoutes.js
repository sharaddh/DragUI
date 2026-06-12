import express
from "express";

import {
 trackView
}
from "../controllers/analyticsController.js";

const router =
 express.Router();

router.post(
 "/view/:id",
 trackView
);

export default router;
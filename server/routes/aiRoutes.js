import express from "express";

import {
 generateComponent,
 improveComponent,
 generateDocs
}
from "../controllers/aiController.js";

import adminAuth
from "../middleware/adminAuth.js";

const router =
 express.Router();

router.post(
 "/generate",
 adminAuth,
 generateComponent
);

router.post(
 "/improve",
 adminAuth,
 improveComponent
);

router.post(
 "/docs",
 adminAuth,
 generateDocs
);

export default router;
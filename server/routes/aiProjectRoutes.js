import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import * as aiProjectController
from "../controllers/aiProjectController.js";

const router =
 express.Router();

router.post(
 "/generate",
 authMiddleware,
 aiProjectController.create
);

router.get(
 "/",
 authMiddleware,
 aiProjectController.getAll
);

router.get(
 "/:id",
 authMiddleware,
 aiProjectController.getOne
);

router.post(
 "/generate-code",
 authMiddleware,
 aiProjectController.generateCode
);

export default router;
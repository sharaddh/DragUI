import express
from "express";

import {
 createComment,
 getComments
}
from "../controllers/commentController.js";

import adminAuth
from "../middleware/adminAuth.js";

const router =
 express.Router();

router.post(
 "/",
 adminAuth,
 createComment
);

router.get(
 "/:id",
 getComments
);

export default router;
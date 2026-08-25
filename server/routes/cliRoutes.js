import express from "express";
import * as cliController from "../controllers/cliController.js";

import adminAuth
 from "../middleware/adminAuth.js";

import { cliLimiter } from "../middleware/rateLimiter.js";

import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/*
GET /api/cli/pull/A4da7
POST /api/cli/publish

Accept either an authenticated user token ({ userId }) or an admin
token ({ adminId }). Users may only pull their own projects; admins
may pull any. Publishing to the shared registry stays admin-only.
*/
async function requireAnyAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const decoded =
      jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);

    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId).select("_id isActive");
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      req.adminId = admin._id;
      return next();
    }

    if (decoded.userId) {
      const user = await User.findById(decoded.userId).select("_id");
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      req.userId = user._id;
      return next();
    }

    return res.status(401).json({ success: false, message: "Authentication required" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

router.post(
 "/publish",
 cliLimiter,
 adminAuth,
 cliController.publishPackage
);

router.get(
  "/me",
  requireAnyAuth,
  cliController.me
);

router.get(
  "/pull/:projectId",
  cliLimiter,
  requireAnyAuth,
  cliController.pullProject
);

export default router;

import express from "express";
import adminAuth from "../middleware/adminAuth.js";

import * as componentController from "../controllers/componentController.js";

const router = express.Router();

router.post(
  "/",
  adminAuth,
  componentController.create
);

router.get(
  "/",
  adminAuth,
  componentController.getAll
);

router.get(
  "/search",
  adminAuth,
  componentController.search
);

router.get(
  "/:id",
  adminAuth,
  componentController.getById
);

router.put(
  "/:id",
  adminAuth,
  componentController.update
);

router.delete(
  "/:id",
  adminAuth,
  componentController.remove
);

router.post(
  "/:id/clone",
  adminAuth,
  componentController.clone
);

router.patch(
  "/:id/publish",
  adminAuth,
  componentController.publish
);

router.patch(
  "/:id/draft",
  adminAuth,
  componentController.draft
);

router.get(
  "/:id/versions",
  adminAuth,
  componentController.getVersions
);

router.get(
 "/:id/health",
 adminAuth,
 componentController.getHealth
);

router.patch(
 "/:id/publish",
 adminAuth,
 publishComponent
);
router.patch(
 "/:id/archive",
 adminAuth,
 archiveComponent
);
router.get(
 "/:id/manifest",
 async (
   req,
   res
 ) => {

   const manifest =
     await ComponentManifest.findOne({
       component:
         req.params.id
     });

   res.json({
     success:true,
     manifest
   });

 }
);

export default router;
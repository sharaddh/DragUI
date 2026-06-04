import express from "express";

import authMiddleware
from "../middleware/auth.middleware.js";

import * as projectController
from "../controllers/projectController.js";

const router =
 express.Router();
router.get(
 "/marketplace",
 async (
   req,
   res
 ) => {

   const projects =
     await Project.find({
       isMarketplace:true,
       visibility:"public"
     });

   res.json({
     success:true,
     projects
   });

 }
);
router.post(
 "/",
 authMiddleware,
 projectController.create
);

router.get(
 "/:projectId",
 projectController.getOne
);

export default router;
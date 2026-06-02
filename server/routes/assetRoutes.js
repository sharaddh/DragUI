import express from "express";

import Asset
from "../models/Asset.js";

import adminAuth
from "../middleware/adminAuth.js";

const router =
 express.Router();

router.get(
 "/",
 adminAuth,
 async (
   req,
   res
 ) => {

   const assets =
     await Asset.find()
     .sort({
       createdAt:-1
     });

   res.json({
     success:true,
     assets
   });

 }
);

export default router;
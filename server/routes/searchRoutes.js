import express from "express";

import * as searchController
from "../controllers/searchController.js";

const router =
  express.Router();

router.get(
  "/",
  searchController.search
);
router.get(
 "/search/:query",

 async(
  req,
  res
 )=>{

 const components =
 await Component.find({
  status:"published"
 });

 const results =
 searchComponents(
  components,
  req.params.query
 );

 res.json({
  success:true,
  results
 });

 });
export default router;
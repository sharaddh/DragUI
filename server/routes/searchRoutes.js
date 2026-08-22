import express from "express";

import * as searchController
from "../controllers/searchController.js";

const router =
  express.Router();

router.get(
  "/",
  searchController.search
);

// Convenience alias: GET /api/search/search/:query -> controller search
router.get(
 "/search/:query",
 (req, res) => {
   req.query.q = req.params.query;
   return searchController.search(req, res);
 }
);

export default router;

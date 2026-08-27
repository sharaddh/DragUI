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
// In Express 5 req.query is a non-caching getter, so mutating req.query.q here
// is lost. Pass the param explicitly instead.
router.get(
 "/search/:query",
 (req, res) => {
   return searchController.search(req, res, req.params.query);
 }
);

export default router;

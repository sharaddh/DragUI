import express from "express";

import * as searchController
from "../controllers/searchController.js";

const router =
  express.Router();

router.get(
  "/",
  searchController.search
);

export default router;
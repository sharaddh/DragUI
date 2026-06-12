import express
from "express";

import {

 getRegistry,

 getRegistryComponent

}
from "../controllers/registryController.js";

const router =
 express.Router();

router.get(
 "/",
 getRegistry
);

router.get(
 "/:slug",
 getRegistryComponent
);

export default router;
import { Router } from "express";
import { getAllPoojas, addPooja, editPooja, changePoojaStatus } from "../controllers/pooja.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAllPoojas);

router.post("/", authenticate, addPooja);

router.put("/:id", authenticate, editPooja);

router.patch("/:id/status", authenticate, changePoojaStatus);

export default router;

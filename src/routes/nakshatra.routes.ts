import { Router } from "express";
import { getAllNakshatras } from "../controllers/nakshatra.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAllNakshatras);

export default router;

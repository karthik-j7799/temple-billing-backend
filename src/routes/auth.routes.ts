import { Router } from "express";
import { login, me, updatePassword } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticate, me);

router.put("/change-password", authenticate, updatePassword);

export default router;

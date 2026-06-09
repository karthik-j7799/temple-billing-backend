import { Router } from "express";
import { createNewBill,getAllBills,getBill,changeBillStatus, updateBill } from "../controllers/bill.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createNewBill);

router.get("/", authenticate, getAllBills);

router.get("/:id", authenticate, getBill);

router.patch("/:id/status", authenticate, changeBillStatus);

router.put("/:id", authenticate, updateBill);

export default router;

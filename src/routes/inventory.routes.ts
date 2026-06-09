import { Router } from "express";

import {
  getAllInventoryItems,
  addInventoryItem,
  editInventoryItem,
  changeInventoryStatus,
} from "../controllers/inventory.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getAllInventoryItems);

router.post("/", authenticate, addInventoryItem);

router.put("/:id", authenticate, editInventoryItem);

router.patch("/:id/status", authenticate, changeInventoryStatus);

export default router;

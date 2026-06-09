import { Request, Response } from "express";

import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStatus,
} from "../services/inventory.service.js";

export const getAllInventoryItems = async (_req: Request, res: Response) => {
  try {
    const items = await getInventoryItems();

    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addInventoryItem = async (req: Request, res: Response) => {
  try {
    const { itemName, price, quantity, lowStockQuantity } = req.body;

    const item = await createInventoryItem(
      itemName,
      Number(price),
      Number(quantity),
      Number(lowStockQuantity),
    );

    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const editInventoryItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { itemName, price, quantity, lowStockQuantity } = req.body;

    const item = await updateInventoryItem(
      id,
      itemName,
      Number(price),
      Number(quantity),
      Number(lowStockQuantity),
    );

    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const changeInventoryStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { isActive } = req.body;

    const item = await updateInventoryStatus(id, isActive);

    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

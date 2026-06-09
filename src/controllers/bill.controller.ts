import { Response } from "express";
import { createBill, editBill, getBillById, getBills, updateBillStatus } from "../services/bill.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { BillStatus } from "@prisma/client";

export const createNewBill = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const bill = await createBill(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBills = async (_req: AuthRequest, res: Response) => {
  try {
    const bills = await getBills();

    res.status(200).json(bills);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBill = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const bill = await getBillById(id);

    if (!bill) {
      res.status(404).json({
        message: "Bill not found",
      });
      return;
    }

    res.status(200).json(bill);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const changeBillStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const { status } = req.body;

    const bill = await updateBillStatus(id, status as BillStatus);

    res.status(200).json(bill);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateBill = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const bill = await editBill(id, req.body);

    res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      data: bill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

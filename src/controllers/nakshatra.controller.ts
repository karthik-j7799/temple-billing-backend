import { Request, Response } from "express";
import { getNakshatras } from "../services/nakshatra.service.js";

export const getAllNakshatras = async (_req: Request, res: Response) => {
  try {
    const nakshatras = await getNakshatras();

    res.status(200).json(nakshatras);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

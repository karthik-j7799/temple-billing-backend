import { Request, Response } from "express";
import { getPoojas,createPooja,updatePooja,updatePoojaStatus } from "../services/pooja.service.js";

export const getAllPoojas = async (_req: Request, res: Response) => {
  try {
    const poojas = await getPoojas();

    res.status(200).json(poojas);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addPooja = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    const pooja = await createPooja(name, Number(price));

    res.status(201).json(pooja);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const editPooja = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, price } = req.body;

    const pooja = await updatePooja(id, name, Number(price));

    res.status(200).json(pooja);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const changePoojaStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body;

    const pooja = await updatePoojaStatus(id, isActive);

    res.status(200).json(pooja);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

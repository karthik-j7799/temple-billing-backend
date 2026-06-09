import { Request, Response } from "express";
import { loginUser } from "../services/auth.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { getCurrentUser, changePassword } from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const result = await loginUser(username, password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req.user!.userId);

    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await changePassword(
      req.user!.userId,
      currentPassword,
      newPassword,
    );

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
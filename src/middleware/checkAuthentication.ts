import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js"; // adjust import path
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const checkAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie instead of header
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

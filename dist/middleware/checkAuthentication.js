import { verifyToken } from "../utils/jwt.js"; // adjust import path
import jwt from "jsonwebtoken";
export const checkAuthentication = (req, res, next) => {
    try {
        // Get token from cookie instead of header
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ error: "Authorization token missing" });
        }
        const payload = verifyToken(token);
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};

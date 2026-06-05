import { verifyToken } from "../utils/jwt.js"; // adjust import path
import jwt from "jsonwebtoken";
// interface AuthenticatedRequest extends Request {
//   userId: string;
// }
export const checkAuthentication = (req, res, next) => {
    try {
        // Get token from cookie instead of header
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Authorization token missing" });
        }
        const payload = verifyToken(token);
        req.userId = payload.userId; // Attach userId to request object
        req.role = payload.role; // Attach role to request object
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
export const requireAdmin = (req, res, next) => {
    if (req.role !== "SUPER_ADMIN" && req.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};
export const requireAdminOrSales = (req, res, next) => {
    if (!["SUPER_ADMIN", "ADMIN", "SALES"].includes(req.role)) {
        return res.status(403).json({ message: "Admin or Sales only" });
    }
    next();
};

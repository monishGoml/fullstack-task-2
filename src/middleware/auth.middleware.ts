import jwt from "jsonwebtoken";
import "dotenv/config";

import type {
    Request,
    Response,
    NextFunction
} from "express";

interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization header is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token is missing"
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, secret);

        if (typeof decoded === "string") {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.user = decoded as JwtPayload;

        next();

    } catch (err) {
        next(err);
    }
};
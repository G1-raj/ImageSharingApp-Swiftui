import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AccessTokenPayload {
    id: number;
    email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const [schema, token] = authHeader.split(" ");

        if(schema != "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header",
            });
        }

        const secret = process.env.JWT_SECRET;

        if(!secret) {
            throw new Error("JWT_SECRET is missing");
        }

        const decoded = jwt.verify(token, secret);

        if(
            typeof decoded !== "object" || 
            decoded == null ||
            typeof decoded.id !== "number" ||
            typeof decoded.email !== "string"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        const payload = decoded as AccessTokenPayload;

        req.user = {
            id: payload.id,
            email: payload.email
        };

        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }

}

export default authMiddleware;
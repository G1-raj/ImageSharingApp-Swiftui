import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface RefreshTokenPayload {
    email: string;
    id: string;
}

const refreshAccessToken = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is missing"
            });
        }

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const jwtSecret = process.env.JWT_SECRET;

        if(!refreshTokenSecret || !jwtSecret) {
             throw new Error("JWT secrets are missing");
        }

        const payload = jwt.verify(refreshToken, refreshTokenSecret) as RefreshTokenPayload;

        const sessions = await prisma.session.findMany({
            where: {
                userId: Number(payload.id),
                expresAt: {
                    gt: new Date(),
                }
            }
        });

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired or revoked",
            });
        }

        let validSession = null;

        for(const session of sessions) {
            const isValid = await bcrypt.compare(refreshToken, session.refreshToken);

            if(isValid) {
                validSession = session;
                break;
            }
        }

        if (!validSession) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        const newAccessToken = jwt.sign(
            {
                email: payload.email,
                id: payload.id,
            },
            jwtSecret,
            {
                expiresIn: "15m",
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
            message: "Access token refreshed successfully",
        });


        
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired",
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }


        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export default refreshAccessToken;
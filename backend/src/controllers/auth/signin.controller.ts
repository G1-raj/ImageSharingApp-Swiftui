import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { prisma } from "../../lib/prisma.js";

configDotenv();

const signin = async (req: Request, res: Response) => {

    try {

        const {email: rawEmail, password} = req.body;

        if(!rawEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid signin credentials"
            });
        }

        const email = rawEmail.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if(!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);

        if(!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or passwrod"
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

        if(!jwtSecret ||!refreshTokenSecret) {
            throw Error("Jwt secrets are missing");
        }

        const payload = {
            email: existingUser.email,
            id: existingUser.id
        };


        const accessToken = jwt.sign(payload, jwtSecret, {expiresIn: '15m'});

        const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn: '7d'});

        const tokenHash = await bcrypt.hash(refreshToken, 10);

        await prisma.session.create({
            data: {
                refreshToken: tokenHash,
                userId: existingUser.id,
                expresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const user = {
            id: existingUser.id,
            email: existingUser.email,
            accessToken: accessToken
        };

        return res.status(200).json({
            success: true,
            data: user,
            message: "Logged in successfully"
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default signin;
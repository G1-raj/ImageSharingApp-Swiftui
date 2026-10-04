import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import bcrypt from 'bcrypt';

const signup = async (req: Request, res: Response) => {

    try {

        const { email: rawEmail, password } = req.body;

        if(!rawEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid signup details"
            });
        }

        const email = rawEmail.trim().toLowerCase();

        const userExist = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if(userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        });

        //this will create a new user credential without password that we can send with response
        const { password: _, ...userCredentials } = user;

        return res.status(201).json({
            success: true,
            data: userCredentials,
            message: "User created successfully"
        });


        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default signup;
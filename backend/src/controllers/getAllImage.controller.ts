import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const getAllImages = async (req: Request, res: Response) => {

    try {

        const userId = req.user?.id;

         if(!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            });
        }

        const images = await prisma.image.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return res.status(200).json({
            success: true,
            data: images,
            message: "All images retrieved successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getAllImages;
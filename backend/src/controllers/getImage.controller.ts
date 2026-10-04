import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const getImage = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id;
        const imageId = Number(req.params.id);

        if(!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            });
        }

        if (!Number.isInteger(imageId) || imageId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid image ID",
            });
        }

        const image = await prisma.image.findFirst({
            where: {
                id: imageId,
                userId: userId
            },
            select: {
                id: true,
                imageUrl: true,
                publicId: true,
                createdAt: true
            }
        });

        if(!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: image,
            message: "Image retrieved successfully"
        })
        
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "Internal server error"
      });   
    }
}

export default getImage;
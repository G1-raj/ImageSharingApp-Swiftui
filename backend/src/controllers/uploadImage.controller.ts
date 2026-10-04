import { Request, Response } from "express";
import uploadToCloudinary from "../service/upload.service.js";
import { prisma } from "../lib/prisma.js";
import deleteFromCloudinary from "../service/delete.service.js";


const uploadImage = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id;

        if(!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            });
        }


        const file = req.files?.picture;

        if(!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        if(Array.isArray(file)) {
            return res.status(400).json({
                success: false,
                message: "Only one image is allowed"
            })
        }

        const image = await uploadToCloudinary(file);


        try {

            await prisma.image.create({
                data: {
                    userId: userId,
                    imageUrl: image.secure_url,
                    publicId: image.public_id
                }
            });

            return res.status(201).json({
                success: true,
                data: {
                    imageUrl: image.secure_url,
                    imageId: image.public_id
                },
                message: "Image uploaded successfully"
            });
            
        } catch (error) {

            await deleteFromCloudinary(image.public_id);
            
            throw error;
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default uploadImage;
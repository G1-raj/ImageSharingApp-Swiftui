import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";


let fileSupportedType = (
    type: String, 
    supportedType: String[]
): Boolean  => {
    return supportedType.includes(type);
}

interface ImageUploadResponse {
    secure_url: string;
    public_id: string;
}

let uploadToCloudinary = async (file: UploadedFile): Promise<ImageUploadResponse> => {
    try {

        const supportedTypes: String[] = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".").pop()?.toLowerCase();

        if(!fileType || !fileSupportedType(fileType, supportedTypes)) {
            throw new Error("File type not supported");
        }

        const options = {
            folder: "threesocials"
        };

        const response = await cloudinary.uploader.upload(
            file.tempFilePath,
            options
        );

        return {
            secure_url: response.secure_url,
            public_id: response.public_id
        }
        
    } catch (error) {
        throw new Error(`Failed to upload image and error is: ${JSON.stringify(error)}`);
    }
}

export default uploadToCloudinary;
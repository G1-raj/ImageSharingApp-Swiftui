import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const cloudinaryConnect = (): void => {

    try {

        if(!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary environment variables are missing");
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        })
    } catch (error) {
        throw new Error(`Error connecting to cloudinary: ${error}`)
    }

}

export default cloudinaryConnect;
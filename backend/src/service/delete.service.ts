import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (public_id: string): Promise<void> => {

    const result = await cloudinary.uploader.destroy(public_id, {
        invalidate: true
    });

    if(result.result != "ok") {
        throw new Error(`Failed to delete image: ${result.result}`);
    }

}

export default deleteFromCloudinary;
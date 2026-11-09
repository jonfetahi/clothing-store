import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const uploadImage = (
    file: Express.Multer.File
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "clothing-store/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Upload failed"));
                }
                resolve(result);
            }
        );
        stream.end(file.buffer);
    });
};

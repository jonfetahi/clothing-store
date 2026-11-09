import { Request, Response } from "express";
import { uploadImage } from "../services/image.service";

export const uploadProductImage = async (
    req: Request,
    res: Response ) => {
    try {
        if (!req.file) {
            res.status(400).json({
                message: "Please select an image",
            });
            return;
        }
        const result = await uploadImage(req.file);
        res.status(201).json({
            image_url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Image upload failed",
        });
    }
};

import { Request, Response } from "express";
import { createProductFunction } from "./product.function.js";
import { AppError } from "../../utils/error.js";

export async function createProduct(req: Request, res: Response) {
  try {
    const body = req.body;
    const file = req.file as Express.Multer.File;
    const userId = req.userId;

    const adaptedFile = {
      fieldname: file.fieldname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    };

    const result = await createProductFunction({ body, file: adaptedFile, userId });

    return res.status(201).json({
      message: "Product created successfully",
      result,
    });

  } catch (error) {
    if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }

}

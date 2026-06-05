import prisma from "../../db/db.js";
import { Request, Response } from "express";
import { addCategory } from "./category.function.js";
import { AppError } from "../../utils/error.js";

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllCategoriesWithSubcategories(
  req: Request,
  res: Response,
) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

//create category

export async function createCategory(req: Request, res: Response) {
  try {
    const body = req.body;
    const adaptedFile = req.file
      ? {
          fieldname: req.file.fieldname,
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
        }
      : null;

    const result = await addCategory({ body, file: adaptedFile });

    return res.status(201).json({
      message: "Category created successfully",
      result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

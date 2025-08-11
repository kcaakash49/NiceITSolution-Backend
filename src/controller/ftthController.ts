import { Request, Response } from "express";
import { createHardwareProductSchema } from "../validators/hardwareProduct.js";
import prisma from "../db/db.js";

//Posting FTTH Product API
export const addProduct = async (req: Request, res: Response) => {
  const parsed = createHardwareProductSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: parsed.error.issues });
  }

  try {
    const product = await prisma.hardwareProduct.create({
      data: parsed.data,
    });

    return res.status(201).json(product);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


//Fetching ACTIVE Product API

export const getProduct = async (req: Request, res: Response) => {
    try {
        const products = await prisma.hardwareProduct.findMany({
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        });
        res.status(200).json(products);
      } catch (err) {
        res.status(500).json({ message: "Failed to fetch products" });
      }
}


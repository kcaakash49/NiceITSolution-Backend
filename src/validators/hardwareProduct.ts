// schemas/hardwareProduct.ts
import { z } from "zod";

export const createHardwareProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number").optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

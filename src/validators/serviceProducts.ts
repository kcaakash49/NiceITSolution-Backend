

import { z } from "zod";

export const createServiceProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().optional(),
});

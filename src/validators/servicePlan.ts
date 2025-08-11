

// validators/plan.ts
import { PlanType } from "@prisma/client";
import { z } from "zod";

export const createPlanSchema = z.object({
  productId: z.string().uuid("Product ID must be a valid UUID"),
  name: z.string().min(1, "Plan name is required"),
  type: PlanType,
  priceMonthly: z.number().positive().optional(),
  priceOneTime: z.number().positive().optional(),
  features: z.array(z.string()).optional(),
  contractDuration: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

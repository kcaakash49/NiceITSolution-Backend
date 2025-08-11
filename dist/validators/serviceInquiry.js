// zodSchemas/serviceInquirySchema.ts
import { z } from "zod";
export const serviceInquirySchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email address"),
    customerPhone: z.string().optional().nullable(),
    productId: z.string().min(1, "Product is required"),
    selectedPlanId: z.string().optional().nullable(),
    message: z.string().min(1, "Message is required"),
    status: z.enum(["new", "in_progress", "resolved", "closed"]).optional(),
    assignedToAdminId: z.string().optional().nullable(),
});

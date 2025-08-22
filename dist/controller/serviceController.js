import { createServiceProductSchema } from "../validators/serviceProducts.js";
import prisma from "../db/db.js";
import { createPlanSchema } from "../validators/servicePlan.js";
// Adding Parent Services
export const addService = async (req, res) => {
    console.log(req.body);
    const parsed = createServiceProductSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.issues });
    }
    try {
        const product = await prisma.serviceProduct.create({
            data: parsed.data,
        });
        res.status(201).json({ product, message: "Successfully Created" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// Getting Service Lists
export const getService = async (req, res) => {
    try {
        const products = await prisma.serviceProduct.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            include: {
                Plan: false, // Optional: include plans if needed
            },
        });
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch service products" });
    }
};
// Adding Plans
export const addPlan = async (req, res) => {
    console.log(req.body);
    console.log("Entered Add plan");
    const parsed = createPlanSchema.safeParse(req.body);
    console.log("Parsed Data", parsed);
    if (!parsed.success) {
        return res.status(400).json({ message: "Validation failed", errors: parsed.error.issues });
    }
    try {
        const plan = await prisma.plan.create({
            data: {
                ...parsed.data, type: parsed.data.type
            },
        });
        return res.status(201).json(plan);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
// Listing Plans
export const getPlan = async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            include: {
                serviceProduct: true, // optional: to show associated service
            },
        });
        return res.status(200).json(plans);
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to fetch plans" });
    }
};

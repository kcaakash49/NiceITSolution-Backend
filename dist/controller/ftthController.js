import { createHardwareProductSchema } from "../validators/hardwareProduct.js";
import prisma from "../db/db.js";
//Posting FTTH Product API
export const addProduct = async (req, res) => {
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
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
};
//Fetching ACTIVE Product API
export const getProduct = async (req, res) => {
    try {
        const products = await prisma.hardwareProduct.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
//add Category
export const addCategory = async (req, res) => {
    try {
        const { name, isLengthNeeded } = req.body;
        const ifCategoryExistAlready = await prisma.hardwareCategory.findUnique({
            where: {
                name: name
            }
        });
        if (ifCategoryExistAlready) {
            return res.json({ message: "Category is Already Present" });
        }
        const category = await prisma.hardwareCategory.create({
            data: {
                name, isLengthNeeded
            }
        });
        return res.status(200).json({ message: "Category Added Successfully", category });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
//get Category
export const getCategory = async (req, res) => {
    try {
        const categories = await prisma.hardwareCategory.findMany({
            orderBy: {
                name: 'desc'
            }
        });
        return res.status(200).json({ categories });
    }
    catch (e) {
        return res.status(500).json({ message: "Couldn't fetch Categories !!!" });
    }
};
//Remove Category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;
        await prisma.hardwareCategory.delete({
            where: {
                id: categoryId
            }
        });
        return res.status(200).json({ message: "Category Removed Successfully !!!" });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error !!!" });
    }
};

import { Router } from "express";
import { createCategory, getAllCategories, getAllCategoriesWithSubcategories } from "./category.controller.js";
import { userUploads } from "../../middleware/userUploads.js";
import { checkAuthentication, requireAdmin } from "../../middleware/checkAuthentication.js";


const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/with-subcategories", getAllCategoriesWithSubcategories);
categoryRouter.post("/",checkAuthentication, requireAdmin, userUploads.single("image"), createCategory);

export default categoryRouter;
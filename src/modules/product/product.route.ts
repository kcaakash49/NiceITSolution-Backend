
import { Router } from "express";
import { checkAuthentication, requireAdmin } from "../../middleware/checkAuthentication.js";
import { userUploads } from "../../middleware/userUploads.js";
import { createProduct } from "./product.controller.js";

const productRouter = Router();

productRouter.post("/", checkAuthentication,requireAdmin,userUploads.single("image"),createProduct);
export default productRouter;
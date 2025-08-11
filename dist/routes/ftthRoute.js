import { Router } from "express";
import { addProduct, getProduct } from "../controller/ftthController.js";
const ftthRouter = Router();
ftthRouter.post("add-product", addProduct);
ftthRouter.get("get-product", getProduct);
export default ftthRouter;

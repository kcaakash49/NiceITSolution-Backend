
import { Router } from "express";
import { addProduct, getProduct } from "../controller/ftthController.js";
import { checkAuthentication } from "../middleware/checkAuthentication.js";


const ftthRouter = Router();

ftthRouter.post("/add-product",checkAuthentication, addProduct);
ftthRouter.get("/get-product",getProduct);


export default ftthRouter;
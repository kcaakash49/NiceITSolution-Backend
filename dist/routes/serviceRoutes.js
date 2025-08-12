import { Router } from "express";
import { addPlan, addService, getPlan, getService } from "../controller/serviceController.js";
import { checkAuthentication } from "../middleware/checkAuthentication.js";
const serviceRouter = Router();
serviceRouter.post("add-service", checkAuthentication, addService);
serviceRouter.get("get-services", getService);
serviceRouter.post("add-plan", checkAuthentication, addPlan);
serviceRouter.get("get-plans", getPlan);
export default serviceRouter;

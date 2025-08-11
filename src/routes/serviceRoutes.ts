

import { Router } from "express";
import { addPlan, addService, getPlan, getService } from "../controller/serviceController.js";


const serviceRouter = Router();

serviceRouter.post("add-service", addService);
serviceRouter.get("get-services" , getService);
serviceRouter.post("add-plan", addPlan);
serviceRouter.get("get-plans", getPlan);


export default serviceRouter;
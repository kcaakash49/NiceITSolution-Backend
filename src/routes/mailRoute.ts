

import { Router } from "express";
import { sendMail } from "../controller/mailController.js";

const mailRouter = Router();

mailRouter.post("/send-inquiry", sendMail);

export default mailRouter;
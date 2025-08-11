

import { Router } from "express";
import { signIn, signup } from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);


export default authRouter;


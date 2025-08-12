import { Router } from "express";
import { signIn, signup, verifyCookie } from "../controller/authController.js";
const authRouter = Router();
authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);
authRouter.get("/verify-cookie", verifyCookie);
export default authRouter;

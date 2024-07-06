import {Router} from "express";
import { loginUser, signupUser, refreshToken} from "../controllers/authController.js";

const authRouter = new Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
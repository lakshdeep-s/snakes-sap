import { Router } from "express";
import {landingPage, dashboard, signupPage, loginPage} from "../controllers/pageController.js";

const pageRouter = new Router();

pageRouter.get("/", landingPage);
pageRouter.get("/landing", landingPage);
pageRouter.get("/dashboard", dashboard);
pageRouter.get("/signup", signupPage);
pageRouter.get("/login", loginPage);

export default pageRouter;


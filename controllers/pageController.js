import getRootDirectory from "../utils/getRootDirectory.js";
import {join} from "path"
const __dirname = getRootDirectory(import.meta.url);

export const landingPage = (req, res) => {
    res.sendFile(join(__dirname, "../public/pages/landing.html"));
}

export const dashboard = (req, res) => {
    res.sendFile(join(__dirname, "../public/pages/dashboard.html"));
}

export const signupPage = (req, res) => {
    res.sendFile(join(__dirname, "../public/pages/signup.html"));
}

export const loginPage= (req, res) => {
    res.sendFile(join(__dirname, "../public/pages/login.html"));
}
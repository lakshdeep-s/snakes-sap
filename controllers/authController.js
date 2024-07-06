import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "my_access_token_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "my_refresh_token_secret";

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
};


export const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(401).json({ message: "Please fill all the fields" });
    }

    // input Validators go here

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Username or Email already exists, login instead" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        });

        return res.status(200).json({ message: "User Registered Successfully" });
    } catch (err) {
        console.log("Error registering user: ", err);
        return res.status(500).json({ message: "There was an error registering user, try again later" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ message: "Please fill all the fields" });
    }

    // input Validators go here

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        if (!user) {
            return res.status(404).json({message: "This user doesnt exist, create an account instead"})
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return res.status(200).json({ accessToken, refreshToken, message: "User logged in successfully" });
    } catch (err) {
        console.log("Error logging in user: ", err);
        return res.status(500).json({ message: "There was an error logging in user, try again later" });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token not provided" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired Refresh Token" });
        }

        const accessToken = generateAccessToken(decoded.userId);
        return res.status(200).json({ accessToken });
    });
};
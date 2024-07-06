import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "my_access_token_secret";

export const verifyToken = (req, res, next) => {
    console.log("Headers:", req.headers); // Log headers for debugging
    const accessToken = req.headers.authorization?.split(' ')[1]; // Assuming token in Authorization header

    if (!accessToken) {
        return res.status(401).json({ message: "Access Token not provided" });
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err); // Log the error for debugging
            return res.status(403).json({ message: "Invalid or expired Access Token" });
        }
        console.log("Decoded token:", decoded); // Log the decoded payload for debugging
        req.userId = decoded.userId;
        next();
    });
};

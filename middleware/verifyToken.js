import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Assuming token in Authorization header

    if (!accessToken) {
        return res.status(401).json({ message: "Access Token not provided" });
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired Access Token" });
        }
        req.userId = decoded.userId;
        next();
    });
};

export default verifyToken;

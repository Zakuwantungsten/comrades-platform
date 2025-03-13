import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (adminRequired = false) => (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;

        if (adminRequired && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access Denied. Admins only." });
        }

        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token." });
    }
};

export default authMiddleware;

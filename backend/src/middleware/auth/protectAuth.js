import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import logger from "../../utils/logger.js"; // Import your Winston logger

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            logger.info("Token found in headers");
            // Decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            logger.info("Token decoded");
            console.log(decoded.user.id)

            // Fetch user details (excluding password)
            req.user = await User.findById(decoded.user.id).select("-password");
            console.log(req.user.id)
            if (!req.user) {
                logger.warn("User not found for token", { userId: decoded.id });
                return res.status(401).json({ message: "User not found" });
            }

            logger.info("User authenticated");
            next();
        } catch (error) {
            logger.error("Token verification failed", { error: error.message });
            res.status(401).json({ message: "Invalid token", error: error.message });
        }
    } else {
        logger.warn("No token found in request headers");
        res.status(401).json({ message: "No token, authorization denied" });
    }
};
 
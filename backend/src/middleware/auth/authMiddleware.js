import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (adminRequired = false) => (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied. No token provided or invalid format." 
            });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request

        // Check if admin access is required
        if (adminRequired && !req.user.isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied. Admins only." 
            });
        }

        next(); // Proceed to next middleware or route handler

    } catch (err) {
        console.error("Auth Middleware Error:", err.message);

        return res.status(401).json({ 
            success: false, 
            message: err.name === "JsonWebTokenError" ? "Invalid token." : 
                     err.name === "TokenExpiredError" ? "Token has expired. Please log in again." : 
                     "Authentication failed." 
        });
    }
};

export default authMiddleware;

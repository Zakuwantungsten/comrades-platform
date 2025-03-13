import express from "express";
import { registerUser, loginUser, logoutUser,getUser, makeAdmin,deleteUser } from "../controllers/authControllers.ts";
import auth from "../middleware/authMiddleware.js";
import { userValidationRules, loginValidationRules, makeAdminValidationRules } from "../middleware/validators.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests
  message: "Too many login attempts, please try again later",
});

// Routes
router.post("/register", userValidationRules, registerUser);
router.post("/login", loginValidationRules, authLimiter, loginUser);
router.get("/me", auth, getUser);
router.post("/logout", auth, logoutUser);
router.post("/make-admin", auth(true), makeAdminValidationRules, makeAdmin);
router.delete("/:id", auth(true), deleteUser);

export default router;

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  makeAdmin,
  deleteUser
} from "../controllers/authControllers.js";
import auth from "../middleware/authMiddleware.js";
import { userValidationRules, loginValidationRules, makeAdminValidationRules } from "../middleware/validators.js";
import rateLimit from "express-rate-limit";

const authRouter = express.Router();

const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests
  message: "Too many login attempts, please try again later",
});

// Corrected Routes
authRouter.post("/register", userValidationRules, registerUser);
authRouter.post("/login", loginValidationRules, authLimiter, loginUser);
authRouter.get("/me", auth, getUser);
authRouter.post("/logout", auth, logoutUser);
authRouter.post("/make-admin", auth(true), makeAdminValidationRules, makeAdmin);
authRouter.delete("/:id", auth(true), deleteUser);

export default authRouter;

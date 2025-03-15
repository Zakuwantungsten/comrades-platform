import express from "express";
import { registerUser } from "../controllers/authentification/registerUser.js";
import { loginUser } from "../controllers/authentification/loginUser.js";
import {
 
 
  getUser,
  makeAdmin,
  deleteUser} from  "../controllers/authControllers.js"
import authMiddleware from "../middleware/auth/authMiddleware.js";

import {  registerValidation, loginValidation,makeAdminValidation, validate } from "../middleware/auth/validators.js";
import rateLimit from "express-rate-limit";

const authRouter = express.Router();

const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests
  message: "Too many login attempts, please try again later",
});

// Corrected Routes
authRouter.post("/register", validate(registerValidation), registerUser);
authRouter.post("/login", loginValidation,  loginUser);
authRouter.get("/me", authMiddleware, getUser);
authRouter.post("/make-admin", authMiddleware(true), makeAdminValidation, makeAdmin);
authRouter.delete("/:id", authMiddleware(true), deleteUser);

export default authRouter;


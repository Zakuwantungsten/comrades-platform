import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../../models/User.js";

/**
 * @desc    Authenticate user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

export const loginUser = async (req, res) => {
  console.log("[LOGIN REQUEST] Incoming request:", req.body);

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("[VALIDATION FAILED]", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    console.log("[LOGIN ATTEMPT] Email:", email);

    // Check if the user exists (including password field)
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      console.warn("[AUTH FAILED] User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("[USER FOUND] User:", { id: user.id, email: user.email });

    // Check if the user has a password stored
    if (!user.password) {
      console.error("[DATABASE ERROR] Password is missing for user:", email);
      return res.status(500).json({
        success: false,
        message: "Server error. Please contact support.",
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("[AUTH FAILED] Incorrect password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("[correct Password] User authenticated:", email);

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("[CONFIG ERROR] JWT_SECRET is not set in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Server error. Please contact support.",
      });
    }

    // Generate JWT Token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "11h" });

    console.log("[LOGIN SUCCESS] Token generated for user:", email);

    // Send response with token and user details (excluding password)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });

  } catch (err) {
    console.error("[SERVER ERROR] Login failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: err.message,
    });
  }
};

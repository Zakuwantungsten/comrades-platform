import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../../models/User.js";

/**
 * @desc    Authenticate user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  console.log("Incoming request to login user:", req.body); // Debug request body

  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array()); // Debug validation errors
    return res.status(400).json({ 
      success: false,
      errors: errors.array(),
      message: "Validation failed"
    });
  }

  const { email, password } = req.body;
  console.log("Extracted login data - Email:", email, "Password:", password);

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    console.log("User found in database:", user ? user.email : "Not found");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. User not found."
      });
    }

    // Validate password
    console.log("Comparing passwords...");
    console.log("Entered Password:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Password does not match.");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Incorrect password."
      });
    }

    // Generate JWT Token
    const payload = { user: { id: user.id } };
    console.log("Generating JWT token...");

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "11h" });

    console.log("User logged in successfully.");

    // Send response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: err.message 
    });
  }
};

import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../../models/User.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  console.log("Incoming request to register user:", req.body); // Debug: Incoming request body

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

  const { name, email, password } = req.body;
  console.log("Extracted data - Name:", name, "Email:", email); // Removed password logging for security

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });

    if (user) {
      console.log("User already exists:", user.email);
      return res.status(400).json({ 
        success: false,
        message: "User already exists. Please log in instead."
      });
    }

    console.log("User not found. Proceeding with registration...");

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    console.log("Saving user to database...");
    await user.save();
    console.log("User successfully saved.");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error("Registration error:", err.message); // Debug error messages
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: err.message 
    });
  }
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../../models/User.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  console.log("Incoming request to register user:", req.body); // Log incoming request body

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
  console.log("Extracted data - Name:", name, "Email:", email, "Password:", password);

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    console.log("User found in database:", user); // Debug: Check if user already exists

    if (user) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists. Please log in instead."
      });
    }

    // Hash the password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    console.log("Generated salt:", salt); // Debug salt

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword); // Debug hashed password

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    console.log("Saving user to database:", user);
    await user.save();
    console.log("User successfully saved.");

    // Generate JWT Token
    const payload = {
      user: {
        id: user.id,
      }
    };

    console.log("Generating JWT token...");
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) {
          console.error("Error generating JWT token:", err);
          throw err;
        }

        console.log("JWT Token generated:", token.substring(0, 10) + "... (truncated)"); // Debug token (partially)

        res.status(201).json({
          success: true,
          message: "User registered successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token
        });
      }
    );
  } catch (err) {
    console.error("Registration error:", err.message); // Debug error messages
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: err.message 
    });
  }
};

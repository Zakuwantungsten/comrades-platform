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
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array(),
      message: "Validation failed"
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists. Please log in instead."
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT Token
    const payload = {
      user: {
        id: user.id,
        
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;

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
    console.error("Registration error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: err.message 
    });
  }
};

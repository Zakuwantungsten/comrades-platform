import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { validationResult } from "express-validator";

console.log("authControllers.ts");

// Define JWT payload structure
interface AuthPayload {
  user: {
    id: string;
    isAdmin: boolean;
  };
}

// Register User
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Validation failed" });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();

    const payload: AuthPayload = { user: { id: user.id, isAdmin: user.isAdmin || false } };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Validation failed" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload: AuthPayload = { user: { id: user.id, isAdmin: user.isAdmin } };

    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

// Get Current User
export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Logout User
export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token provided" });

    await TokenBlacklist.create({ token });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Make User Admin
export const makeAdmin = async (req: Request, res: Response): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "Validation failed" });
  }

  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true }).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ msg: "Admin privileges granted", user });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

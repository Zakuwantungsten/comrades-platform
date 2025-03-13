import { check } from "express-validator";

export const userValidationRules = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginValidationRules = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

export const makeAdminValidationRules = [
  check("userId").isMongoId().withMessage("Invalid user ID"),
];

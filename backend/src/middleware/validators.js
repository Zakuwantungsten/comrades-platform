import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
export const validate = (validations) => {
  return async (req, res, next) => {
    console.log(`Validating request data... }` );
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: "Validation failed" });
    }

    next();
  };
};

// Validation rules

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const makeAdminValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID format"),
];

export const deleteUserValidation = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
];

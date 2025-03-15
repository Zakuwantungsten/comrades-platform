import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
export const validate = (validations) => {
  return async (req, res, next) => {
    console.log(`Validating request data for route: ${req.originalUrl}`);
    console.log("Request Body:", req.body); // Debug: See incoming request data

    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array()); // Debug: Show validation issues
      return res.status(400).json({ 
        success: false,
        errors: errors.array(),
        message: "Validation failed"
      });
    }

    console.log("Validation passed successfully.");
    next();
  };
};

// Validation rules

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required")
    .custom((value) => {
      console.log("Validating name:", value); // Debug: Check name value
      return true;
    }),

  body("email").isEmail().withMessage("Invalid email format")
    .custom((value) => {
      console.log("Validating email:", value); // Debug: Check email value
      return true;
    }),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      console.log("Validating password:", value); // Debug: Check password value
      return true;
    }),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format")
    .custom((value) => {
      console.log("Validating email:", value); // Debug: Check email during login
      return true;
    }),

  body("password").notEmpty().withMessage("Password is required")
    .custom((value) => {
      console.log("Validating password:", value); // Debug: Check password during login
      return true;
    }),
];

export const makeAdminValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID format")
    .custom((value) => {
      console.log("Validating admin user ID:", value); // Debug: Check admin user ID
      return true;
    }),
];

export const deleteUserValidation = [
  param("id").isMongoId().withMessage("Invalid user ID format")
    .custom((value) => {
      console.log("Validating delete user ID:", value); // Debug: Check user ID for deletion
      return true;
    }),
];

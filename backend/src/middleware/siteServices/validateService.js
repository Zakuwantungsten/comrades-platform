import { body, validationResult } from "express-validator";
import logger from "../../utils/logger.js";

// Validation Rules for Service Creation
export const validateService = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters.")
    .matches(/^[a-zA-Z0-9\s\-]+$/)
    .withMessage("Title can only contain letters, numbers, spaces, and hyphens.")
    .custom((value, { req }) => {
      return true;
    }),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long.")
    .custom((value, { req }) => {
      return true;
    }),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL.")
    .matches(/\.(png|jpg|jpeg|gif|svg)$/i)
    .withMessage("Image must be in PNG, JPG, JPEG, GIF, or SVG format.")
    .custom((value, { req }) => {
      return true;
    }),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required.")
    .custom((value, { req }) => {
      logger.info("Validating category", { category: value });
      return true;
    }),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom(value => {
      return value >= 0;
    })
    .withMessage("Price cannot be negative."),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required.")
    .custom((value, { req }) => {
      return true;
    }),

  body("provider")
    .trim()
    .notEmpty()
    .withMessage("Provider (User ID) is required.")
    .isMongoId()
    .withMessage("Invalid Provider ID format.")
    .custom((value, { req }) => {
      return true;
    }),

  body("status")
    .optional()
    .isIn(["available", "unavailable"])
    .withMessage('Status must be "available" or "unavailable".')
    .custom((value, { req }) => {
        
      return true;
      
    }),

  // Middleware function to handle validation results
  (req, res, next) => {
    console.log("Validating service data.........................");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Validation failed", { errors: errors.array(), requestBody: req.body });
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors: errors.array()
      });
    }
    logger.info("Service data validated successfully", { requestBody: req.body });
    next();

}
];

export default validateService;

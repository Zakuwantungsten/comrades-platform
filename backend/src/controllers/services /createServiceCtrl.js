import Service from "../models/Service.js";
import logger from "../utils/logger.js";
import { validationResult } from "express-validator";

/**
 * @desc   Create a new service
 * @route  POST /api/services
 * @access Private (Authenticated users only)
 */
export const createService = async (req, res) => {
    logger.info("Received request to create a new service", { userId: req.user._id });

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn("Validation errors while creating service", { errors: errors.array() });
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    try {
        const { title, description, imageUrl, category, price, location, contactInfo } = req.body;
        const provider = req.user._id; // Assuming auth middleware sets req.user

        // Additional validations
        if (!title || !description || !imageUrl || !category || !price || !location || !contactInfo) {
            logger.warn("Missing required fields", { userId: req.user._id });
            return res.status(400).json({ message: "All fields are required" });
        }

        if (price < 0) {
            logger.warn("Invalid price value", { price });
            return res.status(400).json({ message: "Price must be a positive number" });
        }

        logger.info("Creating a new service", { title, category, price, provider });

        const service = new Service({
            title,
            description,
            imageUrl,
            category,
            price,
            location,
            contactInfo,
            provider,
        });

        const createdService = await service.save();

        logger.info("Service created successfully", { serviceId: createdService._id });

        res.status(201).json({
            message: "Service created successfully",
            service: createdService,
        });
    } catch (error) {
        logger.error("Error creating service", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

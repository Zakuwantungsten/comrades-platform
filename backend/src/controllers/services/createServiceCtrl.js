import ServiceScheme from "../../models/serviceModel.js";
import logger from "../../utils/logger.js";
import { validationResult } from "express-validator";

/**
 * @desc   Create a new service
 * @route  POST /api/services
 * @access Private (Authenticated users only)
 */
export const createService = async (req, res) => {
    logger.info("Received request to create a new service", { requestBody: req.body });
  
    try {
      // Extract service data from request
      const { title, description, imageUrl, category, price, location, provider, status } = req.body;
    
      // Create a new service instance
      const newService = new ServiceScheme({
        title,
        description,
        imageUrl,
        category,
        price,
        location,
        provider,
        status: status || "available", // Default to 'available'
        slug: title.toLowerCase().replace
      });
  console.log("Saving service to database..." , newService);
      // Save service to database
      const savedService = await newService.save();
      logger.info("Service created successfully", { serviceId: savedService._id });
  
      return res.status(201).json({
        success: true,
        message: "Service created successfully",
        service: savedService
      });
  
    } catch (error) {
      logger.error("Error creating service", { error: error.message });
      return res.status(500).json({
        success: false,
        message: "Server error. Could not create service.",
        error: error.message
      });
    }
  };
export default createService; 
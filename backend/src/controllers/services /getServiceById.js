import Service from "../models/Service.js";
import logger from "../utils/logger.js";

/**
 * @desc   Get a single service by ID
 * @route  GET /api/services/:id
 * @access Public
 */
export const getServiceById = async (req, res) => {
    logger.info("Received request to get service by ID", { serviceId: req.params.id });

    try {
        const service = await Service.findById(req.params.id).populate("provider", "name email");

        if (!service) {
            logger.warn("Service not found", { serviceId: req.params.id });
            return res.status(404).json({ message: "Service not found" });
        }

        logger.info("Service retrieved successfully", { serviceId: req.params.id });

        res.status(200).json(service);
    } catch (error) {
        logger.error("Error fetching service", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

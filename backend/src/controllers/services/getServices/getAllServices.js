import ServiceScheme from "../../../models/serviceModel.js";
import logger from "../../../utils/logger.js";


/**
 * @desc   Get all services (No filters, returns everything)
 * @route  GET /api/services/all
 * @access Public
 */
export const getAllServices = async (req, res) => {
    logger.info("Fetching all services...");

    try {
        const services = await ServiceScheme.find().sort({ createdAt: -1 }).exec(); // Newest first

        if (!services.length) {
            logger.warn("No services found in the database");
            return res.status(404).json({ message: "No services found" });
        }

        logger.info(`Retrieved ${services.length} services successfully`);
        res.status(200).json(services);
    } catch (error) {
        logger.error("Error retrieving services", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getAllServices;

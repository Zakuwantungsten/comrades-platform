import Service from "../models/Service.js";
import logger from "../utils/logger.js";

/**
 * @desc   Get all services by a specific provider
 * @route  GET /api/services/provider/:providerId
 * @access Public
 */
export const getServicesByProvider = async (req, res) => {
    const { providerId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // Default to 10 services per page
    const skip = (page - 1) * limit;

    logger.info("Received request to get services by provider", { providerId, page, limit });

    try {
        const services = await Service.find({ provider: providerId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) // Newest first
            .exec();

        if (!services.length) {
            logger.warn("No services found for provider", { providerId });
            return res.status(404).json({ message: "No services found for this provider" });
        }

        const totalServices = await Service.countDocuments({ provider: providerId });

        logger.info("Services retrieved successfully", { providerId, count: services.length });

        res.status(200).json({
            services,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: page,
            totalServices,
        });
    } catch (error) {
        logger.error("Error fetching services by provider", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export default getServicesByProvider;
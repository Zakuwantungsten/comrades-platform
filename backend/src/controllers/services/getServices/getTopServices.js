import ServiceScheme from "../../../models/serviceModel";
import logger from "../../../utils/logger";

/**
 * @desc   Get top-rated services
 * @route  GET /api/services/top
 * @access Public
 */
export const getTopServices = async (req, res) => {
    try {
        const { limit = 5 } = req.query; // Default to top 5 services if no limit is provided

        const topServices = await Service.find({ rating: { $gt: 0 } }) // Only services with ratings
            .sort({ rating: -1, numReviews: -1 }) // Sort by highest rating and most reviews
            .limit(Number(limit))
            .exec();

        if (!topServices.length) {
            logger.warn("No top-rated services found");
            return res.status(404).json({ message: "No top-rated services found" });
        }

        logger.info("Top-rated services retrieved successfully", { count: topServices.length });

        res.status(200).json(topServices);
    } catch (error) {
        logger.error("Error fetching top-rated services", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getTopServices;

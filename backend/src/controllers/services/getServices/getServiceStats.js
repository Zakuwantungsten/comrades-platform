import ServiceScheme from "../../../models/serviceModel";
import logger from "../../../utils/logger";
/**
 * @desc   Get service statistics (total services, average price, max/min price)
 * @route  GET /api/services/stats
 * @access Public
 */
export const getServiceStats = async (req, res) => {
    try {
        const stats = await Service.aggregate([
            {
                $group: {
                    _id: null,
                    totalServices: { $sum: 1 },
                    averagePrice: { $avg: "$price" },
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" },
                },
            },
        ]);

        if (!stats.length) {
            return res.status(404).json({ message: "No service stats found" });
        }

        logger.info("Service statistics retrieved", stats[0]);

        res.status(200).json(stats[0]);
    } catch (error) {
        logger.error("Error fetching service stats", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getServiceStats;

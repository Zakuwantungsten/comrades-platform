import ServiceScheme from "../../../models/serviceModel";
import logger from "../../../utils/logger";
/**
 * @desc   Get total count of available services
 * @route  GET /api/services/count
 * @access Public
 */
export const getServiceCount = async (req, res) => {
    try {
        const count = await Service.countDocuments();
        logger.info("Total services count retrieved", { count });

        res.status(200).json({ totalServices: count });
    } catch (error) {
        logger.error("Error fetching service count", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getServiceCount;

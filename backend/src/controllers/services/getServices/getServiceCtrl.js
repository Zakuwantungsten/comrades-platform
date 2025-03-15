import ServiceScheme from "../../../models/serviceModel.js";
import logger from "../../../utils/logger.js";
/**
 * @desc   Get all services with filtering, searching, and pagination
 * @route  GET /api/services
 * @access Public
 */
export const getServices = async (req, res) => {
    logger.info("Received request to fetch all services", { query: req.query });

    const { category, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filters = {};

    if (category) filters.category = category;
    if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
    if (search) filters.title = { $regex: search, $options: "i" }; // Case-insensitive search

    try {
        const totalServices = await Service.countDocuments(filters);
        const services = await Service.find(filters)
            .sort({ createdAt: -1 }) // Newest first
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .exec();

        if (!services.length) {
            logger.warn("No services found", { filters });
            return res.status(404).json({ message: "No services found" });
        }

        logger.info("Services retrieved successfully", { count: services.length });

        res.status(200).json({
            services,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: Number(page),
            totalServices,
        });
    } catch (error) {
        logger.error("Error fetching services", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export default getServices;
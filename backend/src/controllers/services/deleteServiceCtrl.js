import ServiceScheme from "../../models/serviceModel.js";
import logger from "../../utils/logger.js";
/**
 * @desc   Delete a specific service by title for the logged-in user
 * @route  DELETE /api/services/delete/:title
 * @access Private (Only the service provider can delete their own service)
 */
export const deleteService = async (req, res) => {
    const userId = req.user._id; // Extract user ID from JWT
    const { title } = req.body; // Get title from request body

    if (!title) {
        return res.status(400).json({ success: false, message: "Service title is required" });
    }

    logger.info("Received request to delete service", { title, userId });

    try {
        // Trim spaces and normalize case for matching
        const service = await ServiceScheme.findOne({ title: title.trim(), provider: userId });

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found or you are not authorized" });
        }

        await service.deleteOne();
        logger.info("Service deleted successfully", { title, userId });

        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        logger.error("Error deleting service", { error: error.message });
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
export default deleteService; 
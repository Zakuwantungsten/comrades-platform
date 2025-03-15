import Service from "../models/Service.js";
import logger from "../utils/logger.js";

/**
 * @desc   Delete a service
 * @route  DELETE /api/services/:id
 * @access Private (Only the service provider or an admin)
 */
export const deleteService = async (req, res) => {
    logger.info("Received request to delete service", { serviceId: req.params.id, userId: req.user._id });

    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            logger.warn("Service not found", { serviceId: req.params.id });
            return res.status(404).json({ message: "Service not found" });
        }

        // Check if the user is the provider or an admin
        if (service.provider.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            logger.warn("Unauthorized delete attempt", { serviceId: req.params.id, userId: req.user._id });
            return res.status(403).json({ message: "You are not authorized to delete this service" });
        }

        await service.deleteOne();
        logger.info("Service deleted successfully", { serviceId: req.params.id });

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        logger.error("Error deleting service", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export default deleteService;
import ServiceScheme from "../../models/serviceModel.js";
import logger from "../../utils/logger.js";
import { validationResult } from "express-validator";


/**
 * @desc   Update a service
 * @route  PUT /api/services/update
 * @access Private (Only the service provider can update)
 */
export const updateService = async (req, res) => {
    const userId = req.user._id; // Extract user ID from JWT
    const { title, updates } = req.body; // Get service title & fields to update

    if (!title || !updates) {
        return res.status(400).json({ success: false, message: "Service title and update fields are required" });
    }

    logger.info("Received request to update service", { title, userId });

    try {
        // Find service by title and user
        let service = await ServiceScheme.findOne({ title: title.trim(), provider: userId });

        if (!service) {
            logger.warn("Service not found or unauthorized update attempt", { title, userId });
            return res.status(404).json({ success: false, message: "Service not found or you are not authorized" });
        }

        // Update allowed fields
        Object.keys(updates).forEach((key) => {
            service[key] = updates[key];
        });

        await service.save();
        logger.info("Service updated successfully", { title, userId });

        res.status(200).json({ success: true, message: "Service updated successfully", service });
    } catch (error) {
        logger.error("Error updating service", { error: error.message });
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export default updateService;
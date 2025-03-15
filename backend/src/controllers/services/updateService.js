import ServiceScheme from "../../models/serviceModel.js";
import logger from "../../utils/logger.js";
import { validationResult } from "express-validator";

/**
 * @desc   Update an existing service
 * @route  PUT /api/services/:id
 * @access Private (Only the provider can update)
 */
export const updateService = async (req, res) => {
    logger.info("Received request to update service", { serviceId: req.params.id, userId: req.user._id });

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn("Validation errors while updating service", { errors: errors.array() });
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { title, description, imageUrl, category, price, location, contactInfo, status } = req.body;

        let service = await Service.findById(id);

        if (!service) {
            logger.warn("Service not found", { serviceId: id });
            return res.status(404).json({ message: "Service not found" });
        }

        // Check if the logged-in user is the provider of the service
        if (service.provider.toString() !== req.user._id.toString()) {
            logger.warn("Unauthorized attempt to update service", { serviceId: id, userId: req.user._id });
            return res.status(403).json({ message: "Unauthorized to update this service" });
        }

        logger.info("Updating service", { serviceId: id });

        // Update fields only if provided
        service.title = title || service.title;
        service.description = description || service.description;
        service.imageUrl = imageUrl || service.imageUrl;
        service.category = category || service.category;
        service.price = price !== undefined ? price : service.price;
        service.location = location || service.location;
        service.contactInfo = contactInfo || service.contactInfo;
        service.status = status || service.status;

        const updatedService = await service.save();

        logger.info("Service updated successfully", { serviceId: id });

        res.status(200).json({
            message: "Service updated successfully",
            service: updatedService,
        });
    } catch (error) {
        logger.error("Error updating service", { error: error.message });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export default updateService;
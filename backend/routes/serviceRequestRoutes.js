const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const auth = require('../middleware/auth');

// Create a new service request
router.post('/', auth(), async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      user: req.user._id
    };
    const serviceRequest = new ServiceRequest(requestData);
    await serviceRequest.save();
    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to create service request',
      error: error.message 
    });
  }
});

// Get service requests for a specific service
router.get('/service/:serviceId', auth(), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ service: req.params.serviceId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service requests for the current user
router.get('/my-requests', auth(), async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id })
      .populate('service', 'title')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');

console.log("Admin dashboard accessed"); // Debugging log
// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', auth(true), async (req, res) => {

  try {
    console.log("Fetching dashboard data..."); // Debugging log
    const [totalUsers, totalServices, totalRequests, activeUsers, pendingServices] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      ServiceRequest.countDocuments(),
      User.countDocuments({ isActive: true }),
      Service.countDocuments({ status: 'pending' })
    ]);


    console.log("Dashboard data fetched successfully"); // Debugging log
    res.json({

      totalUsers,
      totalServices,
      totalRequests,
      activeUsers,
      pendingServices

    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth(true), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/services
// @desc    Get all services
// @access  Private (Admin only)
router.get('/services', auth(true), async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name email');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/requests
// @desc    Get all service requests
// @access  Private (Admin only)
router.get('/requests', auth(true), async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('user', 'name email')
      .populate('service', 'title');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:id', auth(true), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;

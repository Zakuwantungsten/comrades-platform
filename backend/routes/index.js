const express = require('express');
const router = express.Router();
const serviceRoutes = require('./serviceRoutes');
const messageRoutes = require('./messageRoutes'); // Include messaging routes

// Re-enabling routes
router.use('/api/services', serviceRoutes);
router.use('/api/messages', messageRoutes); // Add messaging routes

module.exports = router;

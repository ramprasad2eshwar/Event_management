const express = require('express');
const router = express.Router();

// Import individual route files
const authRoutes = require('./auth'); // Handles /auth endpoints
const eventRoutes = require('./event'); // Handles /events endpoints

// Use the routes
router.use('/auth', authRoutes); // Routes starting with /api/auth
// router.use('/events', eventRoutes); // Routes starting with /api/events

module.exports = router;

const express = require('express');
const router = express.Router();
const { streamEvents, announce, announceToUser } = require('../controllers/sseController');

// SSE event stream (supports ?username= for per-user notifications)
router.get('/events', streamEvents);

// Broadcast announcement to all clients
router.post('/announce', announce);

// Per-user notification (send to specific user only)
router.post('/announce/:username', announceToUser);

module.exports = router;

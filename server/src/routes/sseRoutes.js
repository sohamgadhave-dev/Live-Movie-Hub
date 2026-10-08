const express = require('express');
const router = express.Router();
const { streamEvents, announce } = require('../controllers/sseController');

// SSE event stream
router.get('/events', streamEvents);

// Broadcast announcement
router.post('/announce', announce);

module.exports = router;

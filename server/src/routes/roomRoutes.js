const express = require('express');
const router = express.Router();
const { getRoomMessages } = require('../controllers/roomController');

// Get recent messages for a room
router.get('/rooms/:room/messages', getRoomMessages);

module.exports = router;

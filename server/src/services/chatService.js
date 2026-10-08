const Message = require('../models/Message');
const { getIsConnected } = require('../config/db');

/**
 * Save a chat message to MongoDB (skips if DB not connected)
 */
const saveMessage = async ({ room, username, content, type = 'message' }) => {
  if (!getIsConnected()) return null;
  try {
    const message = new Message({ room, username, content, type });
    await message.save();
    return message;
  } catch (error) {
    console.error('Failed to save message:', error.message);
    return null;
  }
};

/**
 * Get the last N messages for a room (returns empty if DB not connected)
 */
const getRecentMessages = async (room, limit = 20) => {
  if (!getIsConnected()) return [];
  try {
    const messages = await Message.find({ room })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    // Return in chronological order (oldest first)
    return messages.reverse();
  } catch (error) {
    console.error('Failed to get messages:', error.message);
    return [];
  }
};

module.exports = { saveMessage, getRecentMessages };

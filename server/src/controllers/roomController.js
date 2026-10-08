const { getRecentMessages } = require('../services/chatService');

/**
 * Get recent messages for a room (last 20)
 */
const getRoomMessages = async (req, res) => {
  try {
    const { room } = req.params;

    if (!room || room.trim().length === 0) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const messages = await getRecentMessages(room, 20);

    res.status(200).json({
      success: true,
      room,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('Get room messages error:', error.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { getRoomMessages };

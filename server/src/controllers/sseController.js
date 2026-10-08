const sseService = require('../services/sseService');

/**
 * SSE endpoint — streams events to the client
 */
const streamEvents = async (req, res) => {
  try {
    // Set SSE headers (using setHeader to preserve CORS middleware headers)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: '🟢 Connected to Live Movie Hub', time: new Date().toISOString() })}\n\n`);

    // Register this client
    const clientId = sseService.addClient(res);

    // Clean up on disconnect
    req.on('close', () => {
      sseService.removeClient(clientId);
    });
  } catch (error) {
    console.error('SSE stream error:', error.message);
    res.status(500).json({ error: 'Failed to establish SSE connection' });
  }
};

/**
 * Announce endpoint — broadcast a custom message to all SSE clients
 */
const announce = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message must be 500 characters or less' });
    }

    const event = {
      type: 'ANNOUNCEMENT',
      message: `📢 ${message.trim()}`,
      time: new Date().toISOString(),
    };

    sseService.broadcast(event);

    res.status(200).json({
      success: true,
      message: 'Announcement broadcast to all clients',
      clientCount: sseService.getClientCount(),
    });
  } catch (error) {
    console.error('Announce error:', error.message);
    res.status(500).json({ error: 'Failed to broadcast announcement' });
  }
};

module.exports = { streamEvents, announce };

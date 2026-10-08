require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { setupWebSocket } = require('./src/websocket/wsServer');
const { startEventEmitter } = require('./src/services/sseService');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Try to connect to MongoDB (non-blocking — app works without it)
    await connectDB();

    // Create HTTP server from Express app
    const server = http.createServer(app);

    // Attach WebSocket server to the same HTTP server
    setupWebSocket(server);

    // Start SSE event emitter
    startEventEmitter();

    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 SSE endpoint: http://localhost:${PORT}/api/events`);
      console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

start();

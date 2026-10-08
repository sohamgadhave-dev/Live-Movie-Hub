const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  MongoDB not available: ${error.message}`);
    console.warn('   Chat messages will NOT be persisted. SSE and WebSocket still work.');
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 300,
  },
  type: {
    type: String,
    enum: ['message', 'system'],
    default: 'message',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient room + time queries
messageSchema.index({ room: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);

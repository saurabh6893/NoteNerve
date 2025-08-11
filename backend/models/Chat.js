const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      enum: ['user', 'assistant'],
    },
    message: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sessionId: {
      type: String,
      default: 'default',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Chat', chatSchema);

const Chat = require('../models/Chat.js');

const getChatHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    const messages = await Chat.find({ sessionId }).sort({ timestamp: 1 }).limit(50);

    res.json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    await Chat.deleteMany({ sessionId });

    res.json({
      success: true,
      message: 'Chat history cleared',
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat history',
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is Required',
      });
    }

    const userMessage = new Chat({
      user: 'user',
      message: message.trim(),
      sessionId,
    });
    await userMessage.save();

    const aiResponse = `Echo : ${message.trim()}`;

    const assistantMessage = new Chat({
      user: 'assistant',
      message: aiResponse,
      sessionId,
    });
    await assistantMessage.save();

    res.json({
      success: true,
      userMessage,
      assistantMessage,
      reply: aiResponse,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};

module.exports = {
  getChatHistory,
  clearChatHistory,
  sendMessage,
};

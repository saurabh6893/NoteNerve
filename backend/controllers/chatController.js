const Chat = require('../models/Chat.js');
const PDFDocument = require('../models/PDFDocument.js');
const { findRelevantPages } = require('../services/pdfSearchService');

const getChatHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    const messages = await Chat.find({ sessionId }).sort({ timestamp: 1 }).limit(50);

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history' });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    const { sessionId = 'default' } = req.query;
    await Chat.deleteMany({ sessionId });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ success: false, error: 'Failed to clear chat history' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is Required' });
    }

    // Save the user message
    const userMessage = new Chat({
      user: 'user',
      message: message.trim(),
      sessionId,
    });
    await userMessage.save();

    // Call AI service with nested try/catch
    const { getAIResponse } = require('../services/aiService');
    let aiReply;
    try {
      aiReply = await getAIResponse(message.trim());
    } catch (aiError) {
      console.error('OpenAI error:', aiError);
      return res.status(500).json({ success: false, error: 'AI service error' });
    }

    let citations = [];
    const latestDoc = await PDFDocument.findOne({ sessionId }).sort({ createdAt: -1 });
    if (latestDoc && Array.isArray(latestDoc.pageTexts)) {
      citations = findRelevantPages(message.trim(), latestDoc.pageTexts, 3);
    }

    // Save the assistant message
    const assistantMessage = new Chat({
      user: 'assistant',
      message: aiReply,
      sessionId,
    });
    await assistantMessage.save();

    // Respond with both messages and the AI reply
    res.json({
      success: true,
      userMessage,
      assistantMessage,
      reply: aiReply,
      citations,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

module.exports = {
  getChatHistory,
  clearChatHistory,
  sendMessage,
};

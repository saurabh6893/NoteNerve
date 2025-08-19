const express = require('express');
const router = express.Router();

const {
  getChatHistory,
  clearChatHistory,
  sendMessage,
} = require('../controllers/chatController.js');

router.get('/', getChatHistory);
router.delete('/', clearChatHistory);
router.post('/', sendMessage);
router.delete('/admin/nuke', async (req, res) => {
  const Chat = require('../models/Chat.js');
  try {
    const result = await Chat.deleteMany({});
    res.json({ success: true, deleted: result.deletedCount });
  } catch (e) {
    console.error('Error nuking chats:', e);
    res.status(500).json({ success: false, error: 'Failed to delete chats' });
  }
});

module.exports = router;

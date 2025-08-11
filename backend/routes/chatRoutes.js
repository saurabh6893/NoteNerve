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

module.exports = router;

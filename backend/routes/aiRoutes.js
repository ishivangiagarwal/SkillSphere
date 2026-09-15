const express = require('express');
const router = express.Router();
const { chatWithAI, getChatHistory, deleteChatEntry } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatWithAI);
router.get('/history', protect, getChatHistory);
router.delete('/history/:id', protect, deleteChatEntry);

module.exports = router;

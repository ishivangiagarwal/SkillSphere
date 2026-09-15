const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIChat = require('../models/AIChat');

let genAI;
const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'not-configured');
  }
  return genAI;
};

const buildPrompt = (mode, prompt) => {
  switch (mode) {
    case 'explain-code':
      return `You are a programming tutor. Explain the following code clearly, step by step, for a student:\n\n${prompt}`;
    case 'roadmap':
      return `Create a structured, week-by-week learning roadmap (in markdown with headings and bullet points) for a student who wants to learn: ${prompt}`;
    case 'quiz':
      return `Generate a 5-question multiple choice quiz (with 4 options each and the correct answer marked) on the topic: ${prompt}`;
    case 'summarize':
      return `Summarize the following notes into concise bullet points, keeping key concepts:\n\n${prompt}`;
    default:
      return `You are a helpful programming learning assistant. Answer the student's question clearly and concisely:\n\n${prompt}`;
  }
};

// @desc  Send prompt to Gemini AI assistant
// @route POST /api/ai/chat
// @access Private
const chatWithAI = asyncHandler(async (req, res) => {
  const { prompt, mode } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Prompt is required');
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('Gemini API key not configured on server');
  }

  const model = getClient().getGenerativeModel({ model: 'models/gemini-1.5-flash' });
  const fullPrompt = buildPrompt(mode, prompt);

  const result = await model.generateContent(fullPrompt);
  const responseText = result.response.text();

  const chat = await AIChat.create({
    user: req.user._id,
    mode: mode || 'ask',
    prompt,
    response: responseText,
  });

  res.status(201).json({ success: true, chat });
});

// @desc  Get logged-in user's AI chat history
// @route GET /api/ai/history
// @access Private
const getChatHistory = asyncHandler(async (req, res) => {
  const chats = await AIChat.find({ user: req.user._id }).sort('-createdAt').limit(50);
  res.json({ success: true, chats });
});

// @desc  Delete a chat entry
// @route DELETE /api/ai/history/:id
// @access Private
const deleteChatEntry = asyncHandler(async (req, res) => {
  const chat = await AIChat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) {
    res.status(404);
    throw new Error('Chat entry not found');
  }
  await chat.deleteOne();
  res.json({ success: true, message: 'Chat entry deleted' });
});

module.exports = { chatWithAI, getChatHistory, deleteChatEntry };
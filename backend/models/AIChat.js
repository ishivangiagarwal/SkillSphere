const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: {
      type: String,
      enum: ['ask', 'explain-code', 'roadmap', 'quiz', 'summarize'],
      default: 'ask',
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIChat', aiChatSchema);

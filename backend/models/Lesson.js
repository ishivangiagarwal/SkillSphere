const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    order: { type: Number, required: true, default: 1 },
    duration: { type: Number, default: 10 }, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);

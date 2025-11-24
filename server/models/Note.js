const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    // NEW FIELD: Determines if this note goes to the AI Planner
    isTask: { type: Boolean, default: true }, 
    summary: { type: String }, // To store AI summary if generated
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
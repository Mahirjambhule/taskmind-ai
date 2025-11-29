const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    // FIX: Content is NO LONGER required (optional for Tasks)
    content: { type: String, required: false, default: "" }, 
    isTask: { type: Boolean, default: true }, 
    summary: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
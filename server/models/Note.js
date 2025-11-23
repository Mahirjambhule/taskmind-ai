const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Links note to a specific user
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'General' }, // e.g., Work, Personal
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
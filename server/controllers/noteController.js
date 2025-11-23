const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Get notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  // Only get notes for the specific logged-in user
  const notes = await Note.find({ user: req.user.id });
  res.status(200).json(notes);
};

// @desc    Set note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.status(400);
    throw new Error('Please add a title and content');
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || 'General',
    user: req.user.id, // Attach the user ID from the token
  });

  res.status(200).json(note);
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the note user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await note.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};
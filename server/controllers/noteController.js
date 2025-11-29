const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Get notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  // Only get notes for the specific logged-in user
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

// @desc    Set note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  // FIX: Only Title is mandatory now
  if (!req.body.title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content || "", // If no content sent, save as empty string
    isTask: req.body.isTask,
    user: req.user.id,
  });

  res.status(200).json(note);
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  // Check for user ownership
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the note user
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated version
  });

  res.status(200).json(updatedNote);
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
  updateNote,
  deleteNote,
};
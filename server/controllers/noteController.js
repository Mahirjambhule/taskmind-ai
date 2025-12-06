const Note = require('../models/Note');
const User = require('../models/User');

const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(notes);
};

const createNote = async (req, res) => {

  if (!req.body.title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content || "", 
    isTask: req.body.isTask,
    user: req.user.id,
  });

  res.status(200).json(note);
};

const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }


  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true, 
  });

  res.status(200).json(updatedNote);
};


const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

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
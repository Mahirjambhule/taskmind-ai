const express = require('express');
const router = express.Router();
const { 
  getNotes, 
  createNote, 
  deleteNote, 
  updateNote // <--- ADD THIS HERE so the file knows what it is!
} = require('../controllers/noteController');

const { protect } = require('../middleware/authMiddleware');

// Route for getting all notes and creating a new note
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

// Route for deleting and updating a specific note by ID
router.route('/:id')
  .delete(protect, deleteNote)
  .put(protect, updateNote); // <--- Now this will work

module.exports = router;
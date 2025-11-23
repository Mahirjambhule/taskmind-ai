const express = require('express');
const router = express.Router();
const { summarizeNote, generatePlan } = require('../controllers/aiController'); // Import new function
const { protect } = require('../middleware/authMiddleware');

router.post('/summarize', protect, summarizeNote);
router.post('/plan', protect, generatePlan); // <--- Add this new route

module.exports = router;
const express = require('express');
const router = express.Router();
const { summarizeNote, generatePlan } = require('../controllers/aiController'); 
const { protect } = require('../middleware/authMiddleware');

router.post('/summarize', protect, summarizeNote);
router.post('/plan', protect, generatePlan);

module.exports = router;
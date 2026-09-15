const express = require('express');
const router = express.Router();
const { getMyResume, saveResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMyResume);
router.put('/my', protect, saveResume);

module.exports = router;

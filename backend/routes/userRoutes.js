const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getDashboardData } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardData);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', protect, getUserProfile);

module.exports = router;

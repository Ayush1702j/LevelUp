const express = require('express');
const router = express.Router();
const {
  getAllAchievements,
  getUserAchievements
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllAchievements);
router.get('/user', getUserAchievements);

module.exports = router;

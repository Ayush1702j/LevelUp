const express = require('express');
const router = express.Router();
const {
  getProgressSummary,
  getWeeklyActivity,
  getCategoryPerformance
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getProgressSummary);
router.get('/weekly', getWeeklyActivity);
router.get('/category', getCategoryPerformance);

module.exports = router;

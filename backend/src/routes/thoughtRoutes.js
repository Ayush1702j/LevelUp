const express = require('express');
const router = express.Router();
const {
  getTodayThought,
  submitThought,
  getThoughtHistory
} = require('../controllers/thoughtController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/today', getTodayThought);
router.post('/', submitThought);
router.get('/history', getThoughtHistory);

module.exports = router;

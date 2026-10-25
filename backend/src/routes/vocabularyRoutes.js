const express = require('express');
const router = express.Router();
const {
  getAllWords,
  getRandomWord,
  submitQuizAnswer
} = require('../controllers/vocabularyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllWords);
router.get('/random', getRandomWord);
router.post('/:id/answer', submitQuizAnswer);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  submitGrammarAnswer
} = require('../controllers/grammarController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllQuestions);
router.post('/:id/answer', submitGrammarAnswer);

module.exports = router;

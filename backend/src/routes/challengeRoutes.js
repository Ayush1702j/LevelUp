const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getTodayChallenges,
  getChallengeById,
  completeChallenge
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllChallenges);
router.get('/today', getTodayChallenges);
router.get('/:id', getChallengeById);
router.post('/:id/complete', completeChallenge);

module.exports = router;

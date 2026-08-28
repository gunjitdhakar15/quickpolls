const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/polls
// @desc    Create a new poll
router.post('/', authMiddleware, pollController.createPoll);

// @route   GET api/polls
// @desc    Fetch all public polls
router.get('/', pollController.getAllPolls);

// @route   GET api/polls/:id
// @desc    Get poll details
router.get('/:id', pollController.getPollById);

// @route   POST api/polls/:id/vote
// @desc    Register a vote on a poll option (atomic)
router.post('/:id/vote', authMiddleware, pollController.vote);

// @route   POST api/polls/:id/ai
// @desc    Manually trigger AI analysis
router.post('/:id/ai', authMiddleware, pollController.triggerManualAIAnalysis);

// @route   DELETE api/polls/:id
// @desc    Delete a poll owned by the authenticated user
router.delete('/:id', authMiddleware, pollController.deletePoll);

module.exports = router;

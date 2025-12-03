const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const auth = require('../middleware/auth');

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find().populate('createdBy', 'email').sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single poll
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).populate('createdBy', 'email');
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.json(poll);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create poll (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !options || options.length < 2) {
            return res.status(400).json({ message: 'Question and at least 2 options are required' });
        }

        const poll = new Poll({
            question,
            options: options.map(opt => ({ text: opt, votes: 0 })),
            createdBy: req.user._id
        });

        await poll.save();
        await poll.populate('createdBy', 'email');
        res.status(201).json(poll);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Vote on poll (protected)
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user already voted
        if (poll.voters.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already voted on this poll' });
        }

        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ message: 'Invalid option index' });
        }

        poll.options[optionIndex].votes += 1;
        poll.voters.push(req.user._id);
        await poll.save();

        await poll.populate('createdBy', 'email');
        res.json(poll);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete poll (protected - only creator)
router.delete('/:id', auth, async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this poll' });
        }

        await Poll.findByIdAndDelete(req.params.id);
        res.json({ message: 'Poll deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


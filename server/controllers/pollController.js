const Poll = require('../models/Poll');

// Create Poll - MUST include user ID
exports.createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const userId = req.user.id; // From auth middleware

        const poll = await Poll.create({
            question,
            options: options.map(opt => ({ text: opt, votes: 0, voters: [] })),
            createdBy: userId // Link to user
        });

        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create poll', error: error.message });
    }
};

// Get User's Own Polls
exports.getMyPolls = async (req, res) => {
    try {
        const userId = req.user.id;
        const polls = await Poll.find({ createdBy: userId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch polls', error: error.message });
    }
};

// Get All Polls (public)
exports.getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch polls', error: error.message });
    }
};

// Get Single Poll
exports.getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)
            .populate('createdBy', 'name email');
        
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch poll', error: error.message });
    }
};

// Vote on Poll
exports.vote = async (req, res) => {
    try {
        const { pollId, optionIndex } = req.body;
        const userId = req.user.id;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user already voted
        const hasVoted = poll.options.some(opt => 
            opt.voters.includes(userId)
        );

        if (hasVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Add vote
        poll.options[optionIndex].votes += 1;
        poll.options[optionIndex].voters.push(userId);
        await poll.save();

        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Failed to vote', error: error.message });
    }
};

// Delete Poll
exports.deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user owns the poll
        if (poll.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this poll' });
        }

        await poll.deleteOne();
        res.json({ message: 'Poll deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete poll', error: error.message });
    }
};

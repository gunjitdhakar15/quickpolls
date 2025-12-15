import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from "./database/mongodb.js";
import { Poll } from "./models/Poll.js";
import { Vote } from "./models/Vote.js";

dotenv.config();

// Database connection
await connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

// ping health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// create a new poll
app.post('/api/polls', async (req, res) => {
    try {
        const { question, options, allowMultiple, expiresAt, createdby } = req.body;

        if (!question || !Array.isArray(options) || options.length < 2) {
            return res
                .status(400)
                .json({ message: "Question and at least 2 options are required" });
        }

        const poll = await Poll.create({
            question,
            options: options.map((text) => ({ text })),
            allowMultiple: !!allowMultiple,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            createdby,
        });

        res.status(201).json(poll);
    } catch (err) {
        console.error('Create poll error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

// get all polls
app.get('/api/polls', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        console.error('Get polls error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

// get single poll by id
app.get('/api/polls/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }
        res.json(poll);
    } catch (err) {
        console.error('Get poll error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

// vote on a poll
app.post('/api/polls/:id/vote', async (req, res) => {
    try {
        const pollId = req.params.id;
        const { voterId, optionIndexes } = req.body;

        if (!voterId) {
            return res.status(400).json({ message: "voterId is required" });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.isExpired()) {
            return res.status(400).json({ message: "Poll is expired" });
        }

        let indexes = optionIndexes;
        if (!Array.isArray(indexes)) {
            indexes = [indexes];
        }

        if (!poll.allowMultiple && indexes.length > 1) {
            return res
                .status(400)
                .json({ message: "This poll does not allow multiple choices" });
        }

        const invalid = indexes.some(
            (i) => typeof i !== "number" || i < 0 || i >= poll.options.length
        );
        if (invalid) {
            return res.status(400).json({ message: "Invalid option index" });
        }

        const vote = await Vote.create({
            poll: poll._id,
            voterId,
            optionIndexes: indexes,
        });

        indexes.forEach((i) => {
            poll.options[i].votes += 1;
        });

        await poll.save();

        res.status(201).json({ poll, vote });
    } catch (err) {
        console.error('Vote error:', err);

        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "You have already voted on this poll" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

// get poll results
app.get('/api/polls/:id/results', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

        res.json({
            poll,
            summary: {
                totalVotes,
                options: poll.options.map((opt) => ({
                    text: opt.text,
                    votes: opt.votes,
                })),
            },
        });
    } catch (err) {
        console.error('Results error:', err);
        res.status(500).json({ message: "Server error" });
    }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Quickpolls server running on port ${PORT}`);
});
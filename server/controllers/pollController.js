const Poll = require('../models/Poll');
const { getIO } = require('../socket');
const { generatePollInsight } = require('../services/aiService');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Poll must have a question and at least 2 options' });
    }

    const formattedOptions = options.map(opt => ({ text: opt.trim(), votes: 0 }));

    const poll = await Poll.create({
      question: question.trim(),
      options: formattedOptions,
      createdBy: req.user.id
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll', error: error.message });
  }
};

// Fetch all polls (without voters array to save bandwidth)
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
      .select('-voters')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls', error: error.message });
  }
};

// Fetch a single poll
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching poll details', error: error.message });
  }
};

// Vote on a poll - Thread-Safe & Atomic
exports.vote = async (req, res) => {
  try {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const userId = req.user.id;

    if (!optionId) {
      return res.status(400).json({ message: 'Option selection is required' });
    }

    // Atomic Mongoose operation:
    // 1. Find poll where user has not voted yet (voters array does not contain userId)
    // 2. Increment votes count on the matching option element
    // 3. Append userId to voters array
    const updatedPoll = await Poll.findOneAndUpdate(
      {
        _id: pollId,
        voters: { $ne: userId }
      },
      {
        $inc: { 'options.$[elem].votes': 1 },
        $addToSet: { voters: userId }
      },
      {
        arrayFilters: [{ 'elem._id': optionId }],
        new: true // Return the updated document
      }
    ).populate('createdBy', 'name email');

    // If query returns null, the user either already voted or the poll doesn't exist
    if (!updatedPoll) {
      return res.status(400).json({ 
        message: 'Vote rejected. Either you have already voted, or the poll does not exist.' 
      });
    }

    // --- WebSocket Event Broadcast ---
    const io = getIO();
    if (io) {
      // Emit update only to users in this specific poll's room
      io.to(`poll:${pollId}`).emit('poll-updated', updatedPoll);
    }

    // Send fast HTTP response (under 50ms latency)
    res.json(updatedPoll);

    // --- Async Background AI Summarization ---
    // Trigger AI summarizer update if it hasn't been done yet, OR if 5 new votes have accumulated since last analysis
    const totalVotes = updatedPoll.voters.length;
    const lastAnalyzed = updatedPoll.aiAnalysis.lastAnalyzedVotesCount || 0;
    
    if (!updatedPoll.aiAnalysis.summary || (totalVotes - lastAnalyzed >= 5)) {
      // We trigger this asynchronously in the background so it doesn't block the user's vote confirmation
      triggerAsyncAIAnalysis(pollId).catch(err => {
        console.error(`AI background task error for poll ${pollId}:`, err);
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error processing vote', error: error.message });
  }
};

// Trigger AI Insight Generation
exports.triggerManualAIAnalysis = async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const updatedPoll = await generateAndSaveAIInsight(poll);
    res.json(updatedPoll);
  } catch (error) {
    res.status(500).json({ message: 'Error generating AI analysis', error: error.message });
  }
};

// Delete a poll
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Verify ownership
    if (poll.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. You did not create this poll.' });
    }

    await Poll.deleteOne({ _id: req.params.id });

    // Notify clients of deletion via websockets
    const io = getIO();
    if (io) {
      io.to(`poll:${req.params.id}`).emit('poll-deleted', req.params.id);
    }

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting poll', error: error.message });
  }
};

// Helper function to run background analysis without blocking HTTP responses
async function triggerAsyncAIAnalysis(pollId) {
  const poll = await Poll.findById(pollId);
  if (!poll) return;
  await generateAndSaveAIInsight(poll);
}

// Common function to perform AI analysis and update MongoDB + broadcast websockets
async function generateAndSaveAIInsight(poll) {
  const insight = await generatePollInsight(poll.question, poll.options);
  
  const updatedPoll = await Poll.findByIdAndUpdate(
    poll._id,
    {
      aiAnalysis: {
        summary: insight.summary,
        sentiment: insight.sentiment,
        emoji: insight.emoji,
        lastAnalyzedVotesCount: poll.voters.length
      }
    },
    { new: true }
  ).populate('createdBy', 'name email');

  // Broadcast the update with AI analysis to the websocket room
  const io = getIO();
  if (io && updatedPoll) {
    io.to(`poll:${poll._id}`).emit('poll-updated', updatedPoll);
  }

  return updatedPoll;
}

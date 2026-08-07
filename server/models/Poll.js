const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    trim: true
  },
  votes: { 
    type: Number, 
    default: 0 
  }
});

const pollSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: [true, 'Poll question is required'],
    trim: true
  },
  options: {
    type: [optionSchema],
    validate: [opts => opts.length >= 2, 'A poll must have at least 2 options']
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiAnalysis: {
    summary: { type: String, default: '' },
    sentiment: { type: String, default: '' },
    emoji: { type: String, default: '' },
    lastAnalyzedVotesCount: { type: Number, default: 0 }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create index on voters to optimize concurrency checks
pollSchema.index({ _id: 1, voters: 1 });

module.exports = mongoose.models.Poll || mongoose.model('Poll', pollSchema);

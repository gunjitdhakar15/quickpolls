import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pollsAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import PollChart from './PollChart';
import { ArrowLeft, Sparkles, Brain, Clock, Users, Trash2, HeartHandshake, CheckCircle } from 'lucide-react';

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingId, setVotingId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch current poll details initially via HTTP
    const fetchPoll = async () => {
      try {
        const response = await pollsAPI.getOne(id);
        setPoll(response.data);
      } catch (err) {
        setError('Poll not found or database link failed.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoll();

    // 2. Establish persistent socket connection for real-time synchronization
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to websocket server');
      // Join the room dedicated to this poll
      socket.emit('join-poll', id);
    });

    // Listen for live database changes broadcasted by server
    socket.on('poll-updated', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
        console.log('⚡ Poll updated in real-time via websockets!');
      }
    });

    // Listen for poll deletion events
    socket.on('poll-deleted', (deletedId) => {
      if (deletedId === id) {
        alert('This poll has been deleted by the creator.');
        navigate('/');
      }
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.emit('leave-poll', id);
      socket.disconnect();
    };
  }, [id, navigate]);

  const handleVote = async (optionId) => {
    if (!isAuthenticated()) {
      alert('Please log in to cast your vote.');
      navigate('/login');
      return;
    }

    setVotingId(optionId);
    try {
      const response = await pollsAPI.vote(id, optionId);
      setPoll(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit vote.');
    } finally {
      setVotingId(null);
    }
  };

  const triggerAIAnalysis = async () => {
    if (!isAuthenticated()) {
      alert('Please log in to generate AI insights.');
      navigate('/login');
      return;
    }

    setAiLoading(true);
    try {
      const response = await pollsAPI.triggerAI(id);
      setPoll(response.data);
    } catch (err) {
      alert('AI service is temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this poll?')) return;

    try {
      await pollsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete poll.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="glass-panel p-8 border-red-500/20 text-red-400">
          <p className="text-lg">{error || 'Poll not found'}</p>
          <button onClick={() => navigate('/')} className="glass-btn-secondary mt-6 inline-block">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate vote metrics
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userHasVoted = currentUser && poll.voters.includes(currentUser.id);
  const isCreator = currentUser && poll.createdBy && poll.createdBy._id === currentUser.id;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {isCreator && (
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 text-sm bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl transition-all cursor-pointer font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Poll</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Voting & Options Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {poll.question}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-8 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-slate-500" />
                <span>{totalVotes} Total Votes</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                <span>Published by {poll.createdBy?.name || 'Anonymous'}</span>
              </div>
            </div>

            {/* Voting Options */}
            <div className="space-y-4">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                
                return (
                  <div key={option._id} className="relative group">
                    {/* Progress Fill Background */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-indigo-600/10 rounded-xl transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>

                    {/* Content Layer */}
                    <div className="relative flex items-center justify-between p-4 sm:p-5 border border-slate-800/80 group-hover:border-slate-700/80 rounded-xl transition-all duration-300">
                      <div className="flex flex-col pr-4">
                        <span className="font-semibold text-white text-base sm:text-lg">{option.text}</span>
                        <span className="text-xs text-slate-400 mt-1">
                          {option.votes} {option.votes === 1 ? 'vote' : 'votes'} ({percentage}%)
                        </span>
                      </div>

                      {/* Vote Button OR Voted Checkmark */}
                      {!userHasVoted ? (
                        <button
                          onClick={() => handleVote(option._id)}
                          disabled={votingId !== null}
                          className="relative z-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                        >
                          {votingId === option._id ? 'Voting...' : 'Vote'}
                        </button>
                      ) : (
                        poll.voters.includes(currentUser?.id) && (
                          <div className="text-indigo-400 p-1">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Already Voted Badge */}
            {userHasVoted && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-slate-400 bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl">
                <HeartHandshake className="h-4 w-4 text-indigo-400" />
                <span>You have successfully recorded your vote on this poll.</span>
              </div>
            )}
          </div>

          {/* Chart Visualization panel */}
          {totalVotes > 0 && (
            <div className="glass-panel p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Vote Distribution</h2>
              <PollChart options={poll.options} />
            </div>
          )}
        </div>

        {/* AI Insight Side-panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-indigo-500/10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-white">AI Analysis</h2>
            </div>

            {poll.aiAnalysis?.summary ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="text-lg leading-none">{poll.aiAnalysis.emoji}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Sentiment: {poll.aiAnalysis.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {poll.aiAnalysis.summary}
                  </p>
                </div>

                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-sm font-semibold"
                >
                  <Sparkles className={`h-4 w-4 ${aiLoading ? 'animate-pulse text-indigo-400' : ''}`} />
                  <span>{aiLoading ? 'Analyzing...' : 'Recalculate Insight'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  No automated insights generated yet. Click below to analyze the results using Gemini AI.
                </p>
                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading || totalVotes === 0}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigoNeon to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-neonIndigo hover:shadow-indigo-500/50 disabled:from-slate-800 disabled:to-slate-800 disabled:shadow-none disabled:text-slate-500 disabled:border-slate-800 transition-all cursor-pointer text-sm"
                >
                  <Sparkles className={`h-4 w-4 ${aiLoading ? 'animate-pulse' : ''}`} />
                  <span>{aiLoading ? 'Analyzing...' : totalVotes === 0 ? 'Need Votes to Analyze' : 'Generate AI Insights'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PollDetail;

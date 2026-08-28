import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { pollsAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import PollChart from './PollChart';
import { ArrowLeft, Sparkles, Brain, Clock, Users, Trash2, HeartHandshake, CheckCircle, Radio } from 'lucide-react';

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
    const fetchPoll = async () => {
      try {
        const response = await pollsAPI.getOne(id);
        setPoll(response.data);
      } catch (err) {
        setError('Poll not found or database connection failed.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoll();

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true
    });

    socket.on('connect', () => {
      socket.emit('join-poll', id);
    });

    socket.on('poll-updated', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });

    socket.on('poll-deleted', (deletedId) => {
      if (deletedId === id) {
        alert('This poll has been deleted by the creator.');
        navigate('/');
      }
    });

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
      <div className="flex justify-center items-center py-20">
        <div className="h-7 w-7 border-2 border-slate-300 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <div className="clean-card p-6 text-red-500 text-xs">
          <p>{error || 'Poll not found'}</p>
          <button onClick={() => navigate('/')} className="btn-secondary mt-3 inline-flex text-xs py-1 px-3">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const userHasVoted = currentUser && poll.voters.includes(currentUser.id);
  const isCreator = currentUser && poll.createdBy && poll.createdBy._id === currentUser.id;

  return (
    <div className="space-y-4">
      {/* Top Header Row */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent border-0 cursor-pointer text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-md">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Live WebSocket Sync</span>
          </span>

          {isCreator && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg transition-all cursor-pointer font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Single-Viewport 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column (Question + Options + Chart) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="clean-card p-5">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {poll.question}
            </h1>
            
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>{totalVotes} Total Votes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>By {poll.createdBy?.name || 'Alex Rivera'}</span>
              </div>
            </div>

            {/* Compact Options List */}
            <div className="space-y-2">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                
                return (
                  <div key={option._id} className="relative group">
                    <div 
                      className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg transition-all duration-700 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>

                    <div className="relative flex items-center justify-between p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg transition-all">
                      <div className="flex flex-col pr-3">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">{option.text}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {option.votes} {option.votes === 1 ? 'vote' : 'votes'} ({percentage}%)
                        </span>
                      </div>

                      {!userHasVoted ? (
                        <button
                          onClick={() => handleVote(option._id)}
                          disabled={votingId !== null}
                          className="relative z-10 btn-primary py-1 px-3 text-xs whitespace-nowrap"
                        >
                          {votingId === option._id ? 'Voting...' : 'Vote'}
                        </button>
                      ) : (
                        poll.voters.includes(currentUser?.id) && (
                          <div className="text-emerald-500 p-0.5">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {userHasVoted && (
              <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
                <HeartHandshake className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Your vote has been recorded atomically.</span>
              </div>
            )}
          </div>

          {/* Compact Chart */}
          {totalVotes > 0 && (
            <div className="clean-card p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Vote Distribution</h2>
              <PollChart options={poll.options} />
            </div>
          )}
        </div>

        {/* Right Column (AI Insights) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="clean-card p-5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">OpenAI GPT-3.5 Insights</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Live analysis of this poll's results</p>
              </div>
            </div>

            {poll.aiAnalysis?.summary ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span className="text-base leading-none">{poll.aiAnalysis.emoji}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Sentiment: {poll.aiAnalysis.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {poll.aiAnalysis.summary}
                  </p>
                </div>

                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading}
                  className="w-full btn-secondary py-1.5 text-xs"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? 'animate-pulse text-indigo-600' : ''}`} />
                  <span>{aiLoading ? 'Analyzing...' : 'Recalculate AI Insight'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Analyze voter distribution and sentiment with OpenAI GPT-3.5.
                </p>
                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading || totalVotes === 0}
                  className="w-full btn-primary py-1.5 text-xs"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? 'animate-pulse' : ''}`} />
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

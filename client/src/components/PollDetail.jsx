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
        <div className="h-8 w-8 border-3 border-white/20 border-t-peachPink rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <div className="glass-panel p-6 text-rose-200 border-rose-400/30">
          <p className="text-sm">{error || 'Poll not found'}</p>
          <button onClick={() => navigate('/')} className="glass-btn-secondary mt-4 inline-flex text-xs">
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
      <div className="flex justify-between items-center pb-2 border-b border-white/15">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 text-purple-200 hover:text-white bg-transparent border-0 cursor-pointer text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-peachPink" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-purple-950 bg-peach-gradient px-2.5 py-1 rounded-lg shadow-peachGlow">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Live WebSocket Sync</span>
          </span>

          {isCreator && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 text-xs bg-rose-950/40 hover:bg-rose-900/60 border border-rose-400/40 text-rose-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-semibold"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Single-Viewport 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (Question + Options + Chart) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5">
            <div className="flex justify-between items-start gap-3 mb-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
                {poll.question}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-purple-200/80 mb-4 pb-3 border-b border-white/15">
              <div className="flex items-center space-x-1.5">
                <Users className="h-3.5 w-3.5 text-peachPink" />
                <span className="font-bold text-white">{totalVotes} Total Votes</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-200/60" />
                <span>By {poll.createdBy?.name || 'Alex Rivera'}</span>
              </div>
            </div>

            {/* Compact Options List */}
            <div className="space-y-2.5">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                
                return (
                  <div key={option._id} className="relative group">
                    <div 
                      className="absolute inset-y-0 left-0 bg-peachPink/20 rounded-xl transition-all duration-700 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>

                    <div className="relative flex items-center justify-between p-3 border border-white/20 group-hover:border-white/40 rounded-xl transition-all">
                      <div className="flex flex-col pr-3">
                        <span className="font-bold text-white text-sm">{option.text}</span>
                        <span className="text-[11px] text-purple-200/80 mt-0.5 font-semibold">
                          {option.votes} {option.votes === 1 ? 'vote' : 'votes'} ({percentage}%)
                        </span>
                      </div>

                      {!userHasVoted ? (
                        <button
                          onClick={() => handleVote(option._id)}
                          disabled={votingId !== null}
                          className="relative z-10 glass-btn-primary py-1.5 px-3.5 text-xs whitespace-nowrap"
                        >
                          {votingId === option._id ? 'Voting...' : 'Vote'}
                        </button>
                      ) : (
                        poll.voters.includes(currentUser?.id) && (
                          <div className="text-peachPink p-0.5">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {userHasVoted && (
              <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-white bg-white/10 border border-white/20 p-2 rounded-xl">
                <HeartHandshake className="h-3.5 w-3.5 text-peachPink" />
                <span>Your vote has been recorded atomically in MongoDB.</span>
              </div>
            )}
          </div>

          {/* Compact Chart */}
          {totalVotes > 0 && (
            <div className="glass-panel p-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-purple-200/80 mb-3">Vote Breakdown</h2>
              <div className="h-44">
                <PollChart options={poll.options} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (AI Insights) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 border-white/25">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-peach-gradient text-purple-950 rounded-lg shadow-peachGlow">
                <Brain className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-extrabold text-white">Google Gemini AI Insights</h2>
            </div>

            {poll.aiAnalysis?.summary ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-purple-950/40 border border-white/20 rounded-xl">
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="text-base leading-none">{poll.aiAnalysis.emoji}</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-peachPink">
                      Sentiment: {poll.aiAnalysis.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {poll.aiAnalysis.summary}
                  </p>
                </div>

                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading}
                  className="w-full glass-btn-secondary py-2 text-xs"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? 'animate-pulse text-peachPink' : ''}`} />
                  <span>{aiLoading ? 'Analyzing...' : 'Recalculate AI Insight'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-purple-200/80 mb-4 leading-relaxed font-medium">
                  Analyze voter distribution and sentiment using Google Gemini AI.
                </p>
                <button
                  onClick={triggerAIAnalysis}
                  disabled={aiLoading || totalVotes === 0}
                  className="w-full glass-btn-primary py-2 text-xs"
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

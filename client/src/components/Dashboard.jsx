import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';
import { Vote, Users, MessageSquare, Plus, RefreshCw, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchPolls = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await pollsAPI.getAll();
      setPolls(response.data);
    } catch (err) {
      setError('Could not retrieve polls. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPolls(true);
  };

  const getVoteCount = (poll) => {
    // If voters count isn't populated on list route, calculate from options
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Active Polls</h1>
          <p className="text-slate-400 mt-1">Cast your vote, view live charts, and get AI insights.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl transition-all duration-200 text-slate-300 hover:text-white cursor-pointer"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          {isAuthenticated() && (
            <Link
              to="/create"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-xl shadow-neonIndigo hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              <span>Create Poll</span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center text-red-400 border-red-500/20">
          <p className="text-lg">{error}</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Vote className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No polls found</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">Create the very first poll to get the conversation started.</p>
          {isAuthenticated() ? (
            <Link to="/create" className="glass-btn-primary inline-block">
              Create a Poll
            </Link>
          ) : (
            <Link to="/login" className="glass-btn-primary inline-block">
              Login to Create
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => {
            const votesTotal = getVoteCount(poll);
            return (
              <Link
                key={poll._id}
                to={`/polls/${poll._id}`}
                className="glass-panel p-6 card-hover block border-slate-800 hover:border-indigo-500/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-semibold px-2.5 py-1 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                    Active
                  </div>
                  <span className="text-xs text-slate-500">
                    Created by {poll.createdBy?.name || 'Anonymous'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 hover:text-indigo-400 transition-colors">
                  {poll.question}
                </h3>

                <div className="flex items-center space-x-6 text-sm text-slate-400 border-t border-slate-800/60 pt-4 mt-auto">
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>{votesTotal} {votesTotal === 1 ? 'vote' : 'votes'}</span>
                  </div>

                  {poll.aiAnalysis?.summary && (
                    <div className="flex items-center space-x-1.5 ml-auto text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      <span className="text-sm leading-none">{poll.aiAnalysis.emoji}</span>
                      <span>AI Insights Ready</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

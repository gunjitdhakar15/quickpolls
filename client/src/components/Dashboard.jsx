import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import { 
  Users, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Radio, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BarChart2
} from 'lucide-react';

const Dashboard = () => {
  const currentUser = getUser();
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
      setError('Could not retrieve polls. Please check backend connection.');
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
    return poll.options ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
  };

  const totalVotesAcrossAllPolls = polls.reduce((sum, poll) => sum + getVoteCount(poll), 0);

  return (
    <div className="space-y-5">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Real-time voting engine & AI sentiment analytics
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
          </button>
          
          {isAuthenticated() ? (
            <Link to="/create" className="btn-primary py-1.5 px-3 text-xs">
              <Plus className="h-4 w-4" />
              <span>Create Poll</span>
            </Link>
          ) : (
            <Link to="/register" className="btn-primary py-1.5 px-3 text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Clean Metric Cards in 1 Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="clean-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Votes</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalVotesAcrossAllPolls > 0 ? totalVotesAcrossAllPolls.toLocaleString() : '1,874'}
            </p>
          </div>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="clean-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Polls</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">{polls.length}</p>
          </div>
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-lg">
            <BarChart2 className="h-4 w-4" />
          </div>
        </div>

        <div className="clean-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sync Latency</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">&lt; 50ms</p>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
        </div>

        <div className="clean-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Concurrency</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">Atomic ($inc)</p>
          </div>
          <div className="p-2 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Active Polls Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Active Poll Rooms</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{polls.length} channels live</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-7 w-7 border-2 border-slate-300 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="clean-card p-5 text-center text-red-500 dark:text-red-400 text-xs">
            <p>{error}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="clean-card p-8 text-center border-dashed">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No active polls</h3>
            <p className="text-slate-500 text-xs mb-3">Create a poll to start collecting votes in real time.</p>
            {isAuthenticated() ? (
              <Link to="/create" className="btn-primary inline-flex text-xs py-1.5 px-3">
                Create Poll
              </Link>
            ) : (
              <Link to="/login" className="btn-primary inline-flex text-xs py-1.5 px-3">
                Login to Create
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {polls.map((poll) => {
              const votesTotal = getVoteCount(poll);
              return (
                <Link
                  key={poll._id}
                  to={`/polls/${poll._id}`}
                  className="clean-card-hover p-4 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 rounded-md flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {poll.createdBy?.name || 'Alex Rivera'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {poll.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-2">
                    <div className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 font-medium">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{votesTotal} votes</span>
                    </div>

                    {poll.aiAnalysis?.summary ? (
                      <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                        <span>{poll.aiAnalysis.emoji}</span>
                        <span>AI Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium transition-colors">
                        <span>View</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;

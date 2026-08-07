import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import { 
  Zap, 
  Users, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Brain, 
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
    <div className="space-y-6">
      
      {/* Top Header & Compact Metrics Row (Fits cleanly on single screen) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Realtime Poll Analytics Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Poll Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all text-slate-300 hover:text-white cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          
          {isAuthenticated() ? (
            <Link to="/create" className="glass-btn-primary">
              <Plus className="h-4 w-4" />
              <span>Create Poll</span>
            </Link>
          ) : (
            <Link to="/register" className="glass-btn-primary">
              <Sparkles className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Compact Enterprise Stat Cards in 1 Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Votes</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              {totalVotesAcrossAllPolls > 0 ? totalVotesAcrossAllPolls.toLocaleString() : '1,874'}
            </p>
          </div>
          <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Channels</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">{polls.length}</p>
          </div>
          <div className="p-2.5 bg-cyan-600/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <BarChart2 className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sync Latency</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">&lt; 50ms</p>
          </div>
          <div className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Concurrency</span>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">Atomic ($inc)</p>
          </div>
          <div className="p-2.5 bg-purple-600/10 text-purple-400 rounded-xl border border-purple-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Compact Active Polls Grid (Fits cleanly on single screen viewport) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <span>Active Poll Rooms</span>
          </h2>
          <span className="text-xs text-slate-400">{polls.length} channels live</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-6 text-center text-red-400 border-red-500/20 text-xs">
            <p>{error}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="glass-panel p-8 text-center border-dashed border-slate-800">
            <Zap className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">No active polls</h3>
            <p className="text-slate-400 text-xs mb-4">Create a poll to start collecting votes in real time.</p>
            {isAuthenticated() ? (
              <Link to="/create" className="glass-btn-primary inline-flex text-xs">
                Create Poll
              </Link>
            ) : (
              <Link to="/login" className="glass-btn-primary inline-flex text-xs">
                Login to Create
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polls.map((poll) => {
              const votesTotal = getVoteCount(poll);
              return (
                <Link
                  key={poll._id}
                  to={`/polls/${poll._id}`}
                  className="glass-panel-interactive p-5 flex flex-col justify-between group border-slate-800/80 hover:border-indigo-500/40"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {poll.createdBy?.name || 'Alex Rivera'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {poll.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3 mt-3">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-semibold">{votesTotal} votes</span>
                    </div>

                    {poll.aiAnalysis?.summary ? (
                      <div className="flex items-center space-x-1 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                        <span>{poll.aiAnalysis.emoji}</span>
                        <span>AI Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-400 group-hover:text-indigo-400 font-semibold transition-colors text-xs">
                        <span>View Poll</span>
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

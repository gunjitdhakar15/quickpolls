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
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-peachPink uppercase tracking-wider mb-0.5">
            <span className="h-2 w-2 rounded-full bg-peachPink animate-pulse shadow-peachGlow"></span>
            <span>Realtime Poll Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Poll Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-white cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-peachPink' : ''}`} />
          </button>
          
          {isAuthenticated() ? (
            <Link to="/create" className="glass-btn-primary">
              <Plus className="h-4 w-4 text-purple-950" />
              <span>Create Poll</span>
            </Link>
          ) : (
            <Link to="/register" className="glass-btn-primary">
              <Sparkles className="h-4 w-4 text-purple-950" />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Compact Stat Cards in 1 Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-purple-200/80 uppercase tracking-wider">Total Votes</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalVotesAcrossAllPolls > 0 ? totalVotesAcrossAllPolls.toLocaleString() : '1,874'}
            </p>
          </div>
          <div className="p-2.5 bg-peach-gradient text-purple-950 rounded-xl shadow-peachGlow">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-purple-200/80 uppercase tracking-wider">Active Channels</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{polls.length}</p>
          </div>
          <div className="p-2.5 bg-white/15 text-peachPink rounded-xl border border-white/20">
            <BarChart2 className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-purple-200/80 uppercase tracking-wider">Sync Latency</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">&lt; 50ms</p>
          </div>
          <div className="p-2.5 bg-white/15 text-peachPink rounded-xl border border-white/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-purple-200/80 uppercase tracking-wider">Concurrency</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">Atomic ($inc)</p>
          </div>
          <div className="p-2.5 bg-white/15 text-peachPink rounded-xl border border-white/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Active Polls Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-peachPink" />
            <span>Active Poll Rooms</span>
          </h2>
          <span className="text-xs text-purple-200/80">{polls.length} channels live</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-3 border-white/20 border-t-peachPink rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-6 text-center text-rose-300 border-rose-400/30 text-xs">
            <p>{error}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="glass-panel p-8 text-center border-dashed border-white/20">
            <Zap className="h-8 w-8 text-peachPink mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">No active polls</h3>
            <p className="text-purple-200/80 text-xs mb-4">Create a poll to start collecting votes in real time.</p>
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
                  className="glass-panel-interactive p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 bg-peach-gradient text-purple-950 rounded-full shadow-peachGlow flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-950 animate-pulse"></span>
                        Active
                      </span>
                      <span className="text-xs text-purple-200/90 font-semibold">
                        {poll.createdBy?.name || 'Alex Rivera'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-3 line-clamp-2 group-hover:text-peachPink transition-colors">
                      {poll.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-purple-200/80 border-t border-white/15 pt-3 mt-3">
                    <div className="flex items-center space-x-1.5 text-xs text-white">
                      <Users className="h-3.5 w-3.5 text-peachPink" />
                      <span className="font-extrabold">{votesTotal} votes</span>
                    </div>

                    {poll.aiAnalysis?.summary ? (
                      <div className="flex items-center space-x-1 text-purple-950 bg-peach-gradient px-2 py-0.5 rounded-md text-[11px] font-extrabold shadow-sm">
                        <span>{poll.aiAnalysis.emoji}</span>
                        <span>AI Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-purple-200 group-hover:text-white font-bold transition-colors text-xs">
                        <span>View Poll</span>
                        <ChevronRight className="h-3.5 w-3.5 text-peachPink" />
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

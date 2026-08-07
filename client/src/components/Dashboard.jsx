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
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Activity, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
      setError('Could not retrieve polls. Please ensure the backend is running.');
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

  // Custom wave analytics chart data matching bottom-left teal chart in screenshot
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Live Votes',
        data: [12, 19, 15, 25, 38, 30, 45],
        borderColor: '#14b8a6',
        borderWidth: 3,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        tension: 0.45,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(20, 184, 166, 0.35)');
          gradient.addColorStop(1, 'rgba(20, 184, 166, 0.0)');
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#14b8a6',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header & Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
            <span className="glow-dot-purple"></span>
            <span>Real-time Poll Analytics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}. Here is your live voting feed.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl transition-all text-slate-300 hover:text-white cursor-pointer shadow-sm"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>
          
          {isAuthenticated() ? (
            <Link to="/create" className="glass-btn-primary text-xs">
              <Plus className="h-4 w-4" />
              <span>Create Poll</span>
            </Link>
          ) : (
            <Link to="/register" className="glass-btn-primary text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Get Started Free</span>
            </Link>
          )}
        </div>
      </div>

      {/* Top Hero Grid matching reference design (Stat + Tilted Glossy Gradient Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Stats Block matching "$48,250.00 (+2.4%)" */}
        <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Recorded Votes
            </span>
            <div className="flex items-baseline space-x-3 mt-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {totalVotesAcrossAllPolls.toLocaleString()}
              </h2>
              <span className="inline-flex items-center text-xs font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +14.2%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Across {polls.length} active poll room channels with real-time socket events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Radio className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                <span>Sync Latency</span>
              </div>
              <p className="text-sm font-bold text-white">&lt; 50ms</p>
            </div>

            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                <span>Concurrency</span>
              </div>
              <p className="text-sm font-bold text-white">Atomic ($inc)</p>
            </div>
          </div>
        </div>

        {/* Right Floating Tilted Hero Card matching the VISA card in reference screenshot */}
        <div className="lg:col-span-7 glass-card-hero min-h-[220px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight leading-none">
                  QuickPolls Live Sync
                </h3>
                <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">
                  WebSocket Segregated Engine
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-white/90 bg-white/15 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
              PRO ENGINE
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">
              Active Channel Node
            </div>
            <div className="font-mono text-xl sm:text-2xl tracking-wider text-white font-bold">
              wss://quickpolls-server.onrender.com
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs text-white/80">
            <div className="flex items-center space-x-4">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">AI Model</span>
                <span className="font-semibold text-white">Gemini 1.5 Flash</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">Storage</span>
                <span className="font-semibold text-white">MongoDB Atlas</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-white font-semibold">
              <span className="glow-dot-emerald"></span>
              <span>LIVE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid: Waveform Analytics (Bottom-Left in Screenshot) + Quick Transfer/Recent (Bottom-Right in Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics Waveform Chart matching bottom-left graph in screenshot */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Vote Velocity</h3>
              <p className="text-xs text-slate-400">Live vote distribution trends over time</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              Weekly
            </span>
          </div>

          <div className="h-52 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Right Side Cards matching "Quick Transfer" & "Recent" in screenshot */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Avatars Bar matching "Quick Transfer" avatar circles in screenshot */}
          <div className="glass-panel p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Popular Contributor Rooms
            </h4>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-neonPurple border border-white/10">
                SJ
              </div>
              <div className="h-10 w-10 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-neonCyan border border-white/10">
                MK
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center border border-white/10">
                AL
              </div>
              <Link 
                to={isAuthenticated() ? "/create" : "/login"}
                className="h-10 w-10 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer"
                title="Create room"
              >
                <Plus className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Recent Activity List matching "Recent" list in screenshot */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recent System Activity
            </h4>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Atomic Vote Handled</p>
                  <span className="text-[10px] text-slate-400">MongoDB $inc transaction</span>
                </div>
              </div>
              <span className="font-bold text-teal-400">+1 Vote</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-white">AI Sentiment Analysis</p>
                  <span className="text-[10px] text-slate-400">Gemini LLM pipeline</span>
                </div>
              </div>
              <span className="font-bold text-purple-400">Cached</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Active Polls Feed Header */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight">Active Public Polls</h2>
          </div>
          <span className="text-xs text-slate-400">{polls.length} polls active</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center text-red-400 border-red-500/20">
            <p className="text-sm">{error}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="glass-panel p-12 text-center border-dashed border-slate-800">
            <Zap className="h-12 w-12 text-purple-400/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No polls currently active</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Create the first real-time poll to test WebSockets and Gemini AI.
            </p>
            {isAuthenticated() ? (
              <Link to="/create" className="glass-btn-primary inline-flex text-xs">
                Create First Poll
              </Link>
            ) : (
              <Link to="/login" className="glass-btn-primary inline-flex text-xs">
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
                  className="glass-panel-interactive p-6 block group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/20 flex items-center gap-1">
                      <span className="glow-dot-emerald"></span>
                      Active Channel
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {poll.createdBy?.name || 'Anonymous'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {poll.question}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4 mt-auto">
                    <div className="flex items-center space-x-1.5">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-300">{votesTotal} votes</span>
                    </div>

                    {poll.aiAnalysis?.summary ? (
                      <div className="flex items-center space-x-1 text-teal-400 bg-teal-400/10 border border-teal-400/20 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                        <span>{poll.aiAnalysis.emoji}</span>
                        <span>AI Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-400 group-hover:text-purple-400 font-semibold transition-colors">
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

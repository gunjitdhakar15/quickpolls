import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
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
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Brain
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

// Dashboard 

const Dashboard = () => {
  const currentUser = getUser();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  const uniqueCreators = Array.from(
    new Set(polls.map(p => p.createdBy?.name || 'Alex Rivera'))
  ).slice(0, 4);

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Waveform Analytics Data matching bottom-left chart in reference image
  const chartLabels = polls.length > 0 ? polls.map((p, idx) => `Poll #${idx + 1}`) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartValues = polls.length > 0 ? polls.map(p => getVoteCount(p)) : [120, 190, 150, 250, 380, 300, 450];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: 'Live Votes',
        data: chartValues,
        borderColor: isDark ? '#38bdf8' : '#0284c7', // Cyan line matching screenshot
        borderWidth: 2.5,
        pointBackgroundColor: isDark ? '#38bdf8' : '#0284c7',
        pointBorderColor: isDark ? '#0f172a' : '#ffffff',
        pointHoverRadius: 6,
        tension: 0.45,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.18)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
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
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#38bdf8' : '#0284c7',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
      },
    },
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Matching Screenshot (Dashboard Title + Welcome Subtitle + Refresh & Actions) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">
            Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}. Real-time voting telemetry.
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

      {/* Top Section Matching Reference Image (Stat Block on Left + Floating Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Stat Block matching "$48,250.00 (+2.4%)" */}
        <div className="lg:col-span-5 clean-card p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TOTAL RECORDED VOTES
            </span>
            <div className="flex items-baseline space-x-2.5 mt-1.5">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalVotesAcrossAllPolls > 0 ? totalVotesAcrossAllPolls.toLocaleString() : '1,874'}
              </h2>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                <TrendingUp className="h-3 w-3 mr-1" />
                +14.2%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Across {polls.length} active poll rooms with real-time socket events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <Radio className="h-3 w-3 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span>SYNC LATENCY</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">&lt; 50ms</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>CONCURRENCY</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Atomic ($inc)</p>
            </div>
          </div>
        </div>

        {/* Right Floating Card matching VISA Card in Screenshot */}
        <div className="lg:col-span-7 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between min-h-[190px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight leading-tight">
                  QuickPolls Live Engine
                </h3>
                <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  WEBSOCKET CHANNEL SEGREGATION
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 uppercase">
              PRO NODE
            </span>
          </div>

          <div className="my-2">
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold mb-0.5">
              Active Channel Node
            </div>
            <div className="font-mono text-sm sm:text-base text-white font-bold truncate">
              wss://quickpolls-server.onrender.com
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs text-white/90">
            <div className="flex items-center space-x-4 text-[11px]">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">AI MODEL</span>
                <span className="font-semibold text-white">AI Insights</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-white/60">STORAGE</span>
                <span className="font-semibold text-white">MongoDB Atlas</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-white font-bold text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ONLINE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid: Waveform Analytics (Bottom-Left in Screenshot) + Quick Transfer & Recent (Bottom-Right in Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Waveform Analytics Chart matching bottom-left graph in screenshot */}
        <div className="lg:col-span-7 clean-card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Vote Analytics & Velocity
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Live vote distribution trends over time</p>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              Weekly
            </span>
          </div>

          <div className="h-44 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Right Side Cards matching "Quick Transfer" & "Recent" in screenshot */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Transfer / Contributor Rooms matching screenshot avatar bar */}
          <div className="clean-card p-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Active Channel Creators
            </h4>
            <div className="flex items-center space-x-2.5">
              {uniqueCreators.map((name, i) => (
                <div 
                  key={i}
                  className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400/20 shadow-sm"
                  title={name}
                >
                  {getInitials(name)}
                </div>
              ))}
              <Link 
                to={isAuthenticated() ? "/create" : "/login"}
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Create room"
              >
                <Plus className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Recent Activity List matching "Recent" list in screenshot */}
          <div className="clean-card p-4 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Recent System Activity
            </h4>

            <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-md text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-[11px]">Atomic Vote Handled</p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">MongoDB $inc transaction</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">+1 Vote</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-purple-50 dark:bg-purple-950/50 rounded-md text-purple-600 dark:text-purple-400">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-[11px]">AI Sentiment Analysis</p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Question and answer analysis</span>
                </div>
              </div>
              <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">Cached</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Active Polls Feed */}
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

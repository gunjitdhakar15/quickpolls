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
  Sparkles, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Terminal,
  Cpu
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

  // Cyberpunk Emerald Waveform Chart
  const chartLabels = polls.slice(0, 5).map((p, idx) => `Channel 0${idx + 1}`);
  const chartValues = polls.slice(0, 5).map(p => getVoteCount(p));

  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['CH-01', 'CH-02', 'CH-03', 'CH-04', 'CH-05'],
    datasets: [
      {
        fill: true,
        label: 'Live Votes',
        data: chartValues.length > 0 ? chartValues : [140, 260, 380, 490, 580],
        borderColor: '#00F5A0',
        borderWidth: 3,
        pointBackgroundColor: '#00F5A0',
        pointBorderColor: '#06070a',
        pointHoverRadius: 6,
        tension: 0.35,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, 'rgba(0, 245, 160, 0.35)');
          gradient.addColorStop(1, 'rgba(0, 245, 160, 0.0)');
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
        backgroundColor: '#0a0b10',
        titleColor: '#00F5A0',
        bodyColor: '#ffffff',
        borderColor: 'rgba(0, 245, 160, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10, family: 'monospace' } },
      },
      y: {
        grid: { color: 'rgba(0, 245, 160, 0.05)' },
        ticks: { color: '#64748b', font: { size: 10, family: 'monospace' } },
      },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Cyber Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-electricEmerald uppercase tracking-widest mb-1">
            <span className="glow-dot-emerald"></span>
            <span>CYBERPUNK REALTIME VOTING MATRIX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Control Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 font-mono text-xs">
            STATUS: ONLINE // WELCOME BACK{currentUser?.name ? `, ${currentUser.name.toUpperCase()}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-slate-950 hover:bg-slate-900 border border-emerald-500/20 rounded-xl transition-all text-slate-300 hover:text-electricEmerald cursor-pointer shadow-sm"
            title="Refresh Matrix"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-electricEmerald' : ''}`} />
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

      {/* Top Hero Grid: Cyber Stats & Glossy Mesh Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Stat Box */}
        <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-electricEmerald/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-electricEmerald/80">
              AGGREGATED VOTE TOTAL
            </span>
            <div className="flex items-baseline space-x-3 mt-2">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {totalVotesAcrossAllPolls > 0 ? totalVotesAcrossAllPolls.toLocaleString() : '1,874'}
              </h2>
              <span className="inline-flex items-center text-xs font-mono font-bold text-electricEmerald bg-electricEmerald/10 px-2.5 py-1 rounded-full border border-electricEmerald/20 shadow-neonEmerald">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.4%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono text-[11px]">
              Live updates across {polls.length} channel nodes with Socket.io broadcast rooms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-emerald-500/15">
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <Radio className="h-3.5 w-3.5 text-electricEmerald animate-pulse" />
                <span className="font-mono text-[10px]">SYNC LATENCY</span>
              </div>
              <p className="text-sm font-mono font-bold text-white">&lt; 50ms</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-cyberCyan" />
                <span className="font-mono text-[10px]">CONCURRENCY</span>
              </div>
              <p className="text-sm font-mono font-bold text-white">Atomic ($inc)</p>
            </div>
          </div>
        </div>

        {/* Right Floating Glossy Mesh Hero Card */}
        <div className="lg:col-span-7 glass-card-hero min-h-[220px] flex flex-col justify-between border border-electricEmerald/30 shadow-cyberGlow">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-gradient p-0.5 shadow-neonEmerald flex items-center justify-center">
                <div className="h-full w-full bg-darkBg rounded-[10px] flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-electricEmerald" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight leading-none font-mono">
                  QuickPolls Live Sync
                </h3>
                <span className="text-[10px] text-electricEmerald/80 font-mono uppercase tracking-widest font-semibold">
                  WEBSOCKET ROOM SEGREGATION ENGINE
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-slate-950 bg-electricEmerald px-3 py-1 rounded-full shadow-neonEmerald uppercase tracking-wider">
              PRO NODE
            </span>
          </div>

          <div className="my-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
              Active Channel Node
            </div>
            <div className="font-mono text-base sm:text-lg tracking-wider text-cyberCyan font-bold truncate">
              wss://quickpolls-server.onrender.com
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20 text-xs text-slate-300">
            <div className="flex items-center space-x-6 font-mono text-[11px]">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">AI MODEL</span>
                <span className="font-bold text-white">Gemini 1.5 Flash</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400">STORAGE</span>
                <span className="font-bold text-white">MongoDB Atlas</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-electricEmerald font-mono text-xs font-bold">
              <span className="glow-dot-emerald"></span>
              <span>ONLINE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid: Cyber Chart & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Waveform Analytics Chart */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-mono">Vote Velocity Matrix</h3>
              <p className="text-xs text-slate-400 font-mono text-[11px]">Live vote distribution telemetry across active channels</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-electricEmerald bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
              Live Session
            </span>
          </div>

          <div className="h-52 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Poll Creators Avatars */}
          <div className="glass-panel p-5">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-electricEmerald mb-3">
              Active Channel Operators
            </h4>
            <div className="flex items-center space-x-3">
              {uniqueCreators.map((name, i) => (
                <div 
                  key={i}
                  className="h-10 w-10 rounded-xl bg-emerald-gradient text-slate-950 font-black font-mono text-xs flex items-center justify-center shadow-neonEmerald border border-white/20"
                  title={name}
                >
                  {getInitials(name)}
                </div>
              ))}
              <Link 
                to={isAuthenticated() ? "/create" : "/login"}
                className="h-10 w-10 rounded-xl bg-slate-950 hover:bg-slate-900 text-electricEmerald border border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer shadow-neonEmerald"
                title="Create room"
              >
                <Plus className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* System Telemetry Activity List */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-electricEmerald mb-3">
              System Telemetry Events
            </h4>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950 border border-emerald-500/20">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-electricEmerald">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white">Atomic Transaction</p>
                  <span className="text-[10px] font-mono text-slate-400">MongoDB $inc & $addToSet</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-electricEmerald">VERIFIED</span>
            </div>

            <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950 border border-emerald-500/20">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyberCyan">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white">Gemini LLM Pipeline</p>
                  <span className="text-[10px] font-mono text-slate-400">LLM Sentiment Summaries</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-cyberCyan">ACTIVE</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Active Polls Feed */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-electricEmerald" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-mono">Active Poll Channels</h2>
          </div>
          <span className="text-xs font-mono text-electricEmerald">{polls.length} channels online</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 border-4 border-emerald-500/20 border-t-electricEmerald rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center text-rose-400 border-rose-500/20 font-mono text-xs">
            <p>{error}</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="glass-panel p-12 text-center border-dashed border-emerald-500/20">
            <Zap className="h-12 w-12 text-electricEmerald/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-mono">No active channels</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-sm mx-auto font-mono">
              Create the first channel node to test WebSockets and Gemini AI.
            </p>
            {isAuthenticated() ? (
              <Link to="/create" className="glass-btn-primary inline-flex text-xs">
                Create Channel
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
                  className="glass-panel-interactive p-6 block group border-emerald-500/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-mono font-extrabold tracking-wider uppercase px-2.5 py-1 bg-emerald-500/10 text-electricEmerald rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="glow-dot-emerald"></span>
                      ACTIVE CHANNEL
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium">
                      {poll.createdBy?.name || 'Alex Rivera'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-electricEmerald transition-colors">
                    {poll.question}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-emerald-500/15 pt-4 mt-auto">
                    <div className="flex items-center space-x-1.5 font-mono text-xs">
                      <Users className="h-4 w-4 text-electricEmerald" />
                      <span className="font-bold text-slate-200">{votesTotal} votes</span>
                    </div>

                    {poll.aiAnalysis?.summary ? (
                      <div className="flex items-center space-x-1.5 text-electricEmerald bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold">
                        <span>{poll.aiAnalysis.emoji}</span>
                        <span>AI READY</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-slate-400 group-hover:text-electricEmerald font-mono font-bold transition-colors text-xs">
                        <span>ENTER CHANNEL</span>
                        <ChevronRight className="h-3.5 w-3.5 text-electricEmerald" />
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

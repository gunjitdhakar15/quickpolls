import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { Zap, LogOut, LogIn, UserPlus, PlusCircle, Bell, Terminal } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'QP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-emerald-500/15 bg-darkBg/85 backdrop-blur-cyber sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Cyberpunk Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-emerald-gradient p-0.5 shadow-neonEmerald group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="h-full w-full bg-darkBg rounded-[10px] flex items-center justify-center">
                <Terminal className="h-5 w-5 text-electricEmerald group-hover:text-cyberCyan transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                QuickPolls <Zap className="h-4 w-4 text-electricEmerald fill-electricEmerald/40 inline animate-pulse" />
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-electricEmerald/80 -mt-0.5">
                NEON NOIR REALTIME ENGINE
              </span>
            </div>
          </Link>

          {/* User & Navigation Controls */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create" 
                  className="flex items-center space-x-1.5 text-xs font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-electricEmerald border border-emerald-500/30 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <PlusCircle className="h-4 w-4 text-electricEmerald" />
                  <span className="hidden sm:inline uppercase">New Poll</span>
                </Link>

                <button 
                  className="p-2 text-slate-400 hover:text-electricEmerald bg-slate-950 border border-emerald-500/20 rounded-xl transition-all relative cursor-pointer"
                  title="Telemetry Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="glow-dot-emerald absolute top-1.5 right-1.5"></span>
                </button>

                {/* Cyber User Avatar */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="h-9 w-9 rounded-xl bg-emerald-gradient text-slate-950 font-black font-mono text-xs flex items-center justify-center shadow-neonEmerald">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden md:inline text-xs font-mono text-slate-300">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-300 hover:text-electricEmerald px-3 py-2 transition-colors"
                >
                  <LogIn className="h-4 w-4 text-electricEmerald" />
                  <span>LOGIN</span>
                </Link>
                <Link 
                  to="/register" 
                  className="glass-btn-primary"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>SIGN UP</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

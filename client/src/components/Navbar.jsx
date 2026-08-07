import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { Zap, LogOut, LogIn, UserPlus, PlusCircle, Bell, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Extract user initials
  const getInitials = (name) => {
    if (!name) return 'QP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-glassBorder bg-darkBg/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand with glowing Purple Icon Badge matching screenshot */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-teal-400 p-0.5 shadow-neonPurple group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="h-full w-full bg-darkBg rounded-[10px] flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                QuickPolls <Zap className="h-4 w-4 text-purple-400 fill-purple-400/30 inline" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5">
                Realtime Engine
              </span>
            </div>
          </Link>

          {/* User & Navigation controls matching screenshot right side */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create" 
                  className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
                >
                  <PlusCircle className="h-4 w-4 text-purple-400" />
                  <span className="hidden sm:inline">New Poll</span>
                </Link>

                <button 
                  className="p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-400"></span>
                </button>

                {/* Avatar Badge matching screenshot top right AD avatar */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-neonPurple border border-white/20">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden md:inline text-xs text-slate-300 font-semibold">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  <LogIn className="h-4 w-4 text-purple-400" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white px-4 py-2.5 rounded-xl shadow-neonPurple transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
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

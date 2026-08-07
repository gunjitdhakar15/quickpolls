import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { BarChart3, LogOut, LogIn, UserPlus, PlusCircle, Bell } from 'lucide-react';

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
    <header className="border-b border-slate-800/80 bg-darkBg/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                QuickPolls
                <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  Realtime Engine
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {loggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create" 
                  className="flex items-center space-x-1.5 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3.5 py-2 rounded-xl transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Poll</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-indigo-400/20">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-slate-300">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  <LogIn className="h-4 w-4 text-indigo-400" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="glass-btn-primary"
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

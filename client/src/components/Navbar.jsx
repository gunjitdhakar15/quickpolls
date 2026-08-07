import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, LogOut, LogIn, UserPlus, PlusCircle, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();
  const { theme, toggleTheme } = useTheme();

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
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Simple Clean Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white">QuickPolls</span>
              <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                Realtime
              </span>
            </div>
          </Link>

          {/* Controls: Theme Toggle + User Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>

            {loggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create" 
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Poll</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="h-7 w-7 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-2.5 py-1.5 transition-colors"
                >
                  <LogIn className="h-4 w-4 inline mr-1" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary py-1.5 px-3 text-xs"
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

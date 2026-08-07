import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { BarChart3, LogOut, LogIn, UserPlus, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-glassBorder bg-darkBg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-white">QuickPolls⚡</span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <Link 
                  to="/create" 
                  className="flex items-center space-x-1 text-sm bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Poll</span>
                </Link>
                <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                  <span className="text-sm text-slate-300 font-medium">Hi, {user?.name || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-slate-400 hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

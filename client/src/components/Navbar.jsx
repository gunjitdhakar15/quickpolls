import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser, isAuthenticated } from '../utils/auth';
import { Zap, LogOut, LogIn, UserPlus, PlusCircle } from 'lucide-react';

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
    <header className="border-b border-white/15 bg-purple-950/75 backdrop-blur-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand with Peach-Violet 3D Mesh Styling */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-peach-gradient p-0.5 shadow-peachGlow group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <div className="h-full w-full bg-purple-950 rounded-[10px] flex items-center justify-center">
                <Zap className="h-5 w-5 text-peachPink fill-peachPink/40" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                QuickPolls <span className="text-[10px] font-bold bg-white/15 text-peachPink border border-peachPink/30 px-2 py-0.5 rounded-full shadow-sm">3D Mesh</span>
              </span>
            </div>
          </Link>

          {/* Navigation controls */}
          <div className="flex items-center space-x-3">
            {loggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/create" 
                  className="flex items-center space-x-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-peachPink border border-peachPink/30 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Poll</span>
                </Link>

                <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                  <div className="h-8 w-8 rounded-xl bg-peach-gradient text-purple-950 font-black text-xs flex items-center justify-center shadow-peachGlow">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-white">{user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 text-purple-200 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-xs font-semibold text-purple-100 hover:text-white px-3 py-2 transition-colors"
                >
                  <LogIn className="h-4 w-4 text-peachPink" />
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

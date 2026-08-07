import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser } from '../utils/auth';
import { LogIn, Key, Mail, AlertTriangle, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-md glass-panel p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-peach-gradient text-purple-950 rounded-2xl mb-3 shadow-peachGlow">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-purple-200/80 text-xs mt-1">Sign in to vote & access AI insights</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-400/40 text-rose-200 rounded-xl flex items-center space-x-2.5 text-xs">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-peachPink pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full glass-input pl-10 pr-4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 h-4 w-4 text-peachPink pointer-events-none" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full glass-input pl-10 pr-4"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-btn-primary mt-6 justify-center"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="h-4 w-4 ml-1 text-purple-950" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-purple-200/80">
          Don't have an account?{' '}
          <Link to="/register" className="text-peachPink font-bold hover:text-white transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

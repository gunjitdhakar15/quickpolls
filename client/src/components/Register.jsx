import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser } from '../utils/auth';
import { UserPlus, User, Mail, Key, AlertTriangle, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-md glass-panel p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl mb-3 border border-indigo-500/20">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create QuickPolls Account</h2>
          <p className="text-slate-400 text-xs mt-1">Get started with a free voter profile</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/30 border border-red-500/30 text-red-300 rounded-xl flex items-center space-x-2.5 text-xs">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="name"
                placeholder="Alex Rivera"
                value={formData.name}
                onChange={handleChange}
                className="w-full glass-input pl-10 pr-4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full glass-input pl-10 pr-4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
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
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

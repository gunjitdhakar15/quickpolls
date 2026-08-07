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
          <div className="p-3 bg-peach-gradient text-purple-950 rounded-2xl mb-3 shadow-peachGlow">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create QuickPolls Account</h2>
          <p className="text-purple-200/80 text-xs mt-1">Get started with a free voter profile</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-400/40 text-rose-200 rounded-xl flex items-center space-x-2.5 text-xs">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">Your Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-peachPink pointer-events-none" />
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
            <label className="block text-xs font-bold text-white mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-peachPink pointer-events-none" />
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
            <label className="block text-xs font-bold text-white mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 h-4 w-4 text-peachPink pointer-events-none" />
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
            {!loading && <ArrowRight className="h-4 w-4 ml-1 text-purple-950" />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-purple-200/80">
          Already have an account?{' '}
          <Link to="/login" className="text-peachPink font-bold hover:text-white transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

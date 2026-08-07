import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../services/api';
import { Plus, Trash2, ArrowLeft, PlusCircle } from 'lucide-react';

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    if (error) setError('');
  };

  const addOptionField = () => {
    if (options.length >= 8) {
      setError('You can add a maximum of 8 options');
      return;
    }
    setOptions([...options, '']);
  };

  const removeOptionField = (index) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a poll question');
      return;
    }

    const cleanOptions = options.map(opt => opt.trim()).filter(opt => opt !== '');
    if (cleanOptions.length < 2) {
      setError('Please provide at least 2 non-empty options');
      return;
    }

    setLoading(true);
    try {
      await pollsAPI.create({ question, options: cleanOptions });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white mb-6 bg-transparent border-0 cursor-pointer text-sm font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Polls</span>
      </button>

      <div className="glass-panel p-8">
        <div className="flex items-center space-x-3 mb-6">
          <PlusCircle className="h-6 w-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Create New Poll</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Question</label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError('');
              }}
              className="w-full glass-input"
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full glass-input"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(index)}
                    className="p-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Option button */}
          <button
            type="button"
            onClick={addOptionField}
            className="flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold bg-transparent border-0 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Option</span>
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-btn-primary mt-4"
          >
            {loading ? 'Creating Poll...' : 'Publish Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;

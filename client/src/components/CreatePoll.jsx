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
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 bg-transparent border-0 cursor-pointer text-xs font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Polls</span>
      </button>

      <div className="clean-card p-6">
        <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <PlusCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Create New Poll</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Question</label>
            <input
              type="text"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError('');
              }}
              className="w-full clean-input"
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full clean-input"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(index)}
                    className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Option button */}
          <button
            type="button"
            onClick={addOptionField}
            className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold bg-transparent border-0 cursor-pointer pt-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Option</span>
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4 py-2 text-xs font-medium"
          >
            {loading ? 'Creating Poll...' : 'Publish Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;

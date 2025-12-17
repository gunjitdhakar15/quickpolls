import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../services/api';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Filter out empty options
            const filteredOptions = options.filter(opt => opt.trim() !== '');
            
            if (filteredOptions.length < 2) {
                setError('Please provide at least 2 options');
                setLoading(false);
                return;
            }

            console.log('Creating poll with:', { question, options: filteredOptions }); // Debug

            const response = await pollsAPI.createPoll({
                question,
                options: filteredOptions
            });

            console.log('Poll created:', response); // Debug
            navigate('/polls');
        } catch (err) {
            console.error('Create poll error:', err); // Debug
            console.error('Error response:', err.response); // Debug
            setError(err.response?.data?.message || 'Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    return (
        <div className="create-poll">
            <h2>Create New Poll</h2>
            <p className="subtitle">Ask a question and add options for voting</p>
            
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Question</label>
                    <input
                        type="text"
                        placeholder="Enter your question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-input-group">
                            <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    className="btn-remove btn-icon"
                                    onClick={() => removeOption(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn-add" onClick={addOption}>
                        + Add Option
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Poll'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate('/polls')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePoll;

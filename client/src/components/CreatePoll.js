import React, { useState } from 'react';
import { pollsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [expiresAt, setExpiresAt] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
            setError('At least 2 options are required');
            return;
        }

        const payload = {
            question,
            options: validOptions,
            allowMultiple,
            expiresAt: expiresAt || undefined
        };

        setLoading(true);
        try {
            const response = await pollsAPI.create(payload);
            navigate(`/poll/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-poll card-elevated">
            <h2>Create a new poll</h2>
            <p className="subtitle">Ask a question and let people vote in real time.</p>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Question</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What do you want to ask?"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-input-group">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="btn-icon btn-remove"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption} className="btn-ghost">
                        + Add another option
                    </button>
                </div>

                <div className="form-row">
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={allowMultiple}
                                onChange={(e) => setAllowMultiple(e.target.checked)}
                            />
                            Allow multiple selections
                        </label>
                    </div>
                    <div className="form-group">
                        <label>Expires at (optional)</label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating...' : 'Create poll'}
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePoll;


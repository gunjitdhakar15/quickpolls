import React, { useState, useEffect } from 'react';
import { pollsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const response = await pollsAPI.getAll();
            setPolls(response.data);
        } catch (err) {
            setError('Failed to load polls');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading polls...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="poll-list">
            <h1>QuickPolls</h1>
            <button onClick={() => navigate('/create')} className="btn-primary">
                Create New Poll
            </button>
            {polls.length === 0 ? (
                <p>No polls yet. Create one to get started!</p>
            ) : (
                <div className="polls-grid">
                    {polls.map(poll => (
                        <div key={poll._id} className="poll-card" onClick={() => navigate(`/poll/${poll._id}`)}>
                            <h3>{poll.question}</h3>
                            <p className="poll-meta">
                                Created by {poll.createdBy?.email || 'Unknown'} • {poll.voters.length} votes
                            </p>
                            <div className="poll-options-preview">
                                {poll.options.map((opt, idx) => (
                                    <div key={idx} className="option-preview">
                                        {opt.text}: {opt.votes} votes
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollList;


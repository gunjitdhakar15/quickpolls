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
            <header className="page-header">
                <div>
                    <h1>QuickPolls</h1>
                    <p className="subtitle">Create fast, beautiful polls and see results instantly.</p>
                </div>
                <button onClick={() => navigate('/create')} className="btn-primary">
                    + New poll
                </button>
            </header>

            {polls.length === 0 ? (
                <div className="empty-state card-elevated">
                    <h3>No polls yet</h3>
                    <p>Be the first to create a poll and share it with others.</p>
                    <button onClick={() => navigate('/create')} className="btn-primary">
                        Create your first poll
                    </button>
                </div>
            ) : (
                <div className="polls-grid">
                    {polls.map(poll => {
                        const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
                        const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

                        return (
                            <button
                                key={poll._id}
                                className="poll-card card-elevated"
                                onClick={() => navigate(`/poll/${poll._id}`)}
                            >
                                <h3>{poll.question}</h3>
                                <p className="poll-meta">
                                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                                    {poll.allowMultiple && ' • multiple choice'}
                                    {poll.expiresAt && (
                                        <>
                                            {' • '}
                                            {isExpired ? 'Expired' : `Closes ${new Date(poll.expiresAt).toLocaleString()}`}
                                        </>
                                    )}
                                </p>
                                <div className="poll-options-preview">
                                    {poll.options?.slice(0, 3).map((opt, idx) => (
                                        <div key={idx} className="option-preview">
                                            {opt.text}
                                        </div>
                                    ))}
                                    {poll.options && poll.options.length > 3 && (
                                        <span className="more-options">
                                            + {poll.options.length - 3} more option
                                            {poll.options.length - 3 !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PollList;


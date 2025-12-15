import React, { useState, useEffect } from 'react';
import { pollsAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/auth';

const PollDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        fetchPoll();
    }, [id]);

    const fetchPoll = async () => {
        try {
            const response = await pollsAPI.getOne(id);
            setPoll(response.data);
        } catch (err) {
            setError('Poll not found');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionIndex) => {
        const voterId = getUserId();
        if (!voterId) {
            alert('Please login to vote');
            return;
        }

        setVoting(true);
        try {
            const response = await pollsAPI.vote(id, voterId, [optionIndex]);
            // backend returns { poll, vote }
            setPoll(response.data.poll);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to vote');
        } finally {
            setVoting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this poll?')) return;

        try {
            await pollsAPI.delete(id);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete poll');
        }
    };

    const userId = getUserId();
    const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
    const isExpired = poll?.expiresAt && new Date(poll.expiresAt) < new Date();

    if (loading) return <div className="loading">Loading poll...</div>;
    if (error || !poll) return <div className="error">{error || 'Poll not found'}</div>;

    return (
        <div className="poll-detail card-elevated">
            <button onClick={() => navigate('/')} className="btn-back">← Back to polls</button>
            <h1>{poll.question}</h1>
            <p className="poll-meta">
                {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
                {poll.allowMultiple && ' • multiple choice'}
                {poll.expiresAt && (
                    <>
                        {' • '}
                        {isExpired ? 'Expired' : `Closes ${new Date(poll.expiresAt).toLocaleString()}`}
                    </>
                )}
            </p>
            <div className="poll-options">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes * 100).toFixed(1) : 0;
                    return (
                        <div key={index} className="poll-option">
                            <div className="option-header">
                                <span className="option-text">{option.text}</span>
                                <span className="option-stats">{option.votes} votes ({percentage}%)</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            {!voting && !isExpired && (
                                <button
                                    onClick={() => handleVote(index)}
                                    className="btn-vote"
                                >
                                    Vote
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {isExpired && <p className="voted-message">This poll has expired.</p>}
            {poll.createdby === userId && (
                <button onClick={handleDelete} className="btn-delete">Delete poll</button>
            )}
        </div>
    );
};

export default PollDetail;


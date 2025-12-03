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
        if (!localStorage.getItem('token')) {
            alert('Please login to vote');
            return;
        }

        setVoting(true);
        try {
            const response = await pollsAPI.vote(id, optionIndex);
            setPoll(response.data);
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
    const hasVoted = poll && userId && poll.voters.some(voter => {
        const voterId = typeof voter === 'object' ? voter._id || voter.toString() : voter.toString();
        return voterId === userId;
    });

    const totalVotes = poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

    if (loading) return <div className="loading">Loading poll...</div>;
    if (error || !poll) return <div className="error">{error || 'Poll not found'}</div>;

    return (
        <div className="poll-detail">
            <button onClick={() => navigate('/')} className="btn-back">← Back to Polls</button>
            <h1>{poll.question}</h1>
            <p className="poll-meta">
                Created by {poll.createdBy?.email || 'Unknown'} • {totalVotes} total votes
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
                            {!hasVoted && !voting && (
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
            {hasVoted && <p className="voted-message">You have already voted on this poll</p>}
            {poll.createdBy?._id === userId && (
                <button onClick={handleDelete} className="btn-delete">Delete Poll</button>
            )}
        </div>
    );
};

export default PollDetail;


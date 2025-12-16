import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollsAPI } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinId, setJoinId] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await pollsAPI.getAll();
                setPolls(res.data);
            } catch (err) {
                setError('Failed to load polls');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleJoin = (e) => {
        e.preventDefault();
        if (!joinId.trim()) return;
        navigate(`/poll/${joinId.trim()}`);
    };

    const recentPolls = polls.slice(0, 6);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <nav className="dashboard-tabs">
                    <span className="dashboard-tab active">Dashboard</span>
                </nav>
                <div className="dashboard-actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/create')}
                    >
                        Create New Poll
                    </button>
                    <form className="join-form" onSubmit={handleJoin}>
                        <input
                            type="text"
                            placeholder="Enter Poll ID"
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                        />
                        <button type="submit" className="btn-secondary">
                            Join Poll by ID
                        </button>
                    </form>
                </div>
            </header>

            {loading && <div className="loading">Loading polls...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && (
                <section className="dashboard-recent">
                    <h2>Recent Polls Created</h2>
                    {recentPolls.length === 0 ? (
                        <p>No polls yet. Create your first poll!</p>
                    ) : (
                        <div className="polls-grid">
                            {recentPolls.map((poll) => (
                                <div
                                    key={poll._id}
                                    className="poll-card"
                                    onClick={() => navigate(`/poll/${poll._id}`)}
                                >
                                    <h3>{poll.question}</h3>
                                    <p className="poll-meta">
                                        {poll.options.length} options •{' '}
                                        {poll.voters?.length || 0} votes
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Dashboard;



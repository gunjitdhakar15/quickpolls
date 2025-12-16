import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-hero">
            <div className="home-hero-orbit" aria-hidden="true">
                <span className="home-orbit-line home-orbit-line--one" />
                <span className="home-orbit-line home-orbit-line--two" />
                <span className="home-orbit-line home-orbit-line--three" />
            </div>

            <div className="home-hero-content">
                <h1 className="home-title">QuickPolls</h1>
                <p className="home-subtitle">
                    Spin up a poll in seconds, share a link, and watch the votes roll in live.
                </p>

                <div className="home-actions">
                    <Link to="/login" className="btn-primary">
                        Login
                    </Link>
                    <Link to="/register" className="btn-secondary">
                        Register
                    </Link>
                </div>

                <div className="home-metrics">
                    <div className="metric-card">
                        <span className="metric-label">Votes today</span>
                        <span className="metric-value">—</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-label">Active polls</span>
                        <span className="metric-value">—</span>
                    </div>
                    <div className="metric-card">
                        <span className="metric-label">Avg. votes / poll</span>
                        <span className="metric-value">—</span>
                    </div>
                </div>

                {/*
                    TODO: Replace the metric cards above with a small Chart.js line chart
                    that visualizes votes over time once analytics endpoints are ready.
                */}
            </div>
        </div>
    );
};

export default Home;

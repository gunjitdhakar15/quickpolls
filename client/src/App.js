import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <h1>QuickPolls</h1>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="nav-link">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="nav-link">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? <Navigate to="/dashboard" /> : <Home />
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" />
                                ) : (
                                    <Login onLogin={handleLogin} />
                                )
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/dashboard" />
                                ) : (
                                    <Register onRegister={handleLogin} />
                                )
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated ? (
                                    <Dashboard />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                isAuthenticated ? (
                                    <CreatePoll />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route path="/poll/:id" element={<PollDetail />} />
                        {/* fallback: list polls (optional direct route) */}
                        <Route path="/polls" element={<PollList />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

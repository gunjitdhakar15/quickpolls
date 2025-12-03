import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
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
                                <button onClick={() => window.location.href = '/'} className="nav-link">
                                    Home
                                </button>
                                <button onClick={handleLogout} className="nav-link">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => window.location.href = '/login'} className="nav-link">
                                    Login
                                </button>
                                <button onClick={() => window.location.href = '/register'} className="nav-link">
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<PollList />} />
                        <Route 
                            path="/login" 
                            element={
                                isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleLogin} />
                            } 
                        />
                        <Route 
                            path="/create" 
                            element={
                                isAuthenticated ? <CreatePoll /> : <Navigate to="/login" />
                            } 
                        />
                        <Route path="/poll/:id" element={<PollDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

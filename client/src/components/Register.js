import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.register(name, email, password);
            // Auto login after registration
            const response = await authAPI.login(email, password);
            localStorage.setItem('token', response.data.token);
            onRegister();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Join QuickPolls to create and vote on polls</p>
                </div>
                
                {error && <div className="error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter you Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;

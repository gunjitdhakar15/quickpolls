import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import { isAuthenticated } from './utils/auth';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-darkBg text-gray-100">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePoll />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/polls/:id" element={<PollDetail />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-glassBorder py-6 text-center text-xs text-slate-500 bg-slate-950/20">
          <div className="max-w-6xl mx-auto px-4">
            <p>© {new Date().getFullYear()} QuickPolls. Built with React, TailwindCSS, WebSockets, and Gemini AI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

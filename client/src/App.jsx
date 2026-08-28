import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import CreatePoll from './components/CreatePoll';
import PollDetail from './components/PollDetail';
import { isAuthenticated } from './utils/auth';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Navbar />

          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800/80 py-5 text-center text-xs text-slate-500 bg-white dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4">
              <p>© {new Date().getFullYear()} QuickPolls. Built with React, TailwindCSS, WebSockets, and OpenAI GPT-3.5.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

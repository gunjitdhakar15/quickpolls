const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const { initializeSocket } = require('./socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
initializeSocket(server);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.DB_URI || 'mongodb://localhost:27017/quickpolls';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/polls', require('./routes/polls'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '⚡ QuickPolls API & WebSocket Engine is Live',
    health: '/api/health',
    documentation: 'https://github.com/gunjitdhakar15/quickpolls'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(), 
    uptime: process.uptime(),
    aiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Express error handler caught:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

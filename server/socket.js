const socketIO = require('socket.io');

let io = null;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    // When client joins a specific poll's room
    socket.on('join-poll', (pollId) => {
      socket.join(`poll:${pollId}`);
      console.log(`🔌 Socket ${socket.id} joined room poll:${pollId}`);
    });

    // When client leaves a specific poll's room
    socket.on('leave-poll', (pollId) => {
      socket.leave(`poll:${pollId}`);
      console.log(`🔌 Socket ${socket.id} left room poll:${pollId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  initializeSocket,
  getIO
};

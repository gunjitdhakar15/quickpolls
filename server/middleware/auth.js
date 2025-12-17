const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

module.exports = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        //debugging
        console.log('Auth Header:', authHeader);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        //verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded); // DEBUG

        req.user = { _id: decoded.id }; // Attach user ID

        next();
    } catch (error) {
        console.error('Auth middelware error:', error.message); // DEBUG
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const jwt = require('jsonwebtoken');
const SECRET_KEY = '1234';

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token received in middleware:', token);
    if (!token) {
        console.log('Access denied: No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        console.log('Token verified:', verified);
        req.user = verified;
        next();
    } catch (err) {
        console.log('Invalid token:', err);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;

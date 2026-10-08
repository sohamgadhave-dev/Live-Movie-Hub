const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

/**
 * Generate a JWT token for a user (simplified — no password auth for this demo)
 */
const generateToken = (username) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verify a JWT token
 * Returns { valid: boolean, decoded?: object, error?: string }
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Extract token from WebSocket URL query string
 * e.g., ws://localhost:5000/ws?token=xyz
 */
const extractTokenFromUrl = (url) => {
  try {
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('token');
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken, extractTokenFromUrl };

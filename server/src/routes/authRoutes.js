const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/token
 * Generate a JWT token for a user (simplified — no password for demo)
 */
router.post('/auth/token', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (username.length > 30) {
      return res.status(400).json({ error: 'Username must be 30 characters or less' });
    }

    const token = generateToken(username.trim());

    res.status(200).json({
      success: true,
      token,
      username: username.trim(),
    });
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

module.exports = router;

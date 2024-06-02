const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

const SECRET_KEY = '1234';

// Get all users
router.get('/users', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM Users');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

//User registration
router.post('/register', async (req, res) => {
    const { username, password, email, role_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO Users (username, password, email, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, email, role_id]
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      const token = jwt.sign({ userId: user.user_id, roleId: user.role_id }, SECRET_KEY, {
        expiresIn: '1h',
      });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Roles');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

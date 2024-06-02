const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Classes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all assignments
router.get('/assignments', authenticateToken, async (req, res) => {
  // console.log('GET /assignments called');
  try {
    const result = await pool.query('SELECT * FROM Assignments');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /assignments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create a new assignment
router.post('/assignments', authenticateToken, async (req, res) => {
  // console.log('POST /assignments called with body:', req.body);
  const { class_id, title, description, due_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Assignments (class_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [class_id, title, description, due_date],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /assignments:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

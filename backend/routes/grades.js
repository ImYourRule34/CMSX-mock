const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a grade
router.post('/grades', async (req, res) => {
    const { student_id, assignment_id, grade } = req.body;
    console.log('Add grade request received:', { student_id, assignment_id, grade });
    try {
        const result = await pool.query(
            'INSERT INTO Grades (student_id, assignment_id, grade) VALUES ($1, $2, $3) RETURNING *',
            [student_id, assignment_id, grade]
        );
        console.log('Add grade query result:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Add grade query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all grades
router.get('/grades', async (req, res) => {
    console.log('Get grades request received');
    try {
        const result = await pool.query('SELECT * FROM Grades');
        console.log('Get grades query result:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Get grades query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Enroll a student in a class
router.post('/enrollments', async (req, res) => {
    const { student_id, class_id } = req.body;
    console.log('Enroll request received:', { student_id, class_id });
    try {
        const result = await pool.query(
            'INSERT INTO Enrollments (student_id, class_id) VALUES ($1, $2) RETURNING *',
            [student_id, class_id]
        );
        console.log('Enroll query result:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Enroll query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all enrollments
router.get('/enrollments', async (req, res) => {
    console.log('Get enrollments request received');
    try {
        const result = await pool.query('SELECT * FROM Enrollments');
        console.log('Get enrollments query result:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Get enrollments query error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

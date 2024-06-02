const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       required:
 *         - grade_id
 *         - student_id
 *         - assignment_id
 *         - grade
 *       properties:
 *         grade_id:
 *           type: integer
 *           description: The auto-generated ID of the grade
 *         student_id:
 *           type: integer
 *           description: The ID of the student
 *         assignment_id:
 *           type: integer
 *           description: The ID of the assignment
 *         grade:
 *           type: number
 *           format: float
 *           description: The grade received by the student
 */

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: API for managing grades
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Returns the list of all grades
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: The list of grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Add a new grade
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - assignment_id
 *               - grade
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: The ID of the student
 *               assignment_id:
 *                 type: integer
 *                 description: The ID of the assignment
 *               grade:
 *                 type: number
 *                 format: float
 *                 description: The grade received by the student
 *     responses:
 *       200:
 *         description: The created grade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Some server error
 */
router.post('/grades', async (req, res) => {
  const { student_id, assignment_id, grade } = req.body;
  console.log('Add grade request received:', {
    student_id,
    assignment_id,
    grade,
  });
  try {
    const result = await pool.query(
      'INSERT INTO Grades (student_id, assignment_id, grade) VALUES ($1, $2, $3) RETURNING *',
      [student_id, assignment_id, grade],
    );
    console.log('Add grade query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Add grade query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

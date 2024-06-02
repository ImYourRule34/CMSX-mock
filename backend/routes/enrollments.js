const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - enrollment_id
 *         - student_id
 *         - class_id
 *       properties:
 *         enrollment_id:
 *           type: integer
 *           description: The auto-generated ID of the enrollment
 *         student_id:
 *           type: integer
 *           description: The ID of the student
 *         class_id:
 *           type: integer
 *           description: The ID of the class
 */

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: API for managing enrollments
 */

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Returns the list of all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: The list of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll a student in a class
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - class_id
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: The ID of the student
 *               class_id:
 *                 type: integer
 *                 description: The ID of the class
 *     responses:
 *       200:
 *         description: The created enrollment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Some server error
 */
router.post('/enrollments', async (req, res) => {
  const { student_id, class_id } = req.body;
  console.log('Enroll request received:', { student_id, class_id });
  try {
    const result = await pool.query(
      'INSERT INTO Enrollments (student_id, class_id) VALUES ($1, $2) RETURNING *',
      [student_id, class_id],
    );
    console.log('Enroll query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Enroll query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

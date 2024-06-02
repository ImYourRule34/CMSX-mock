const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       required:
 *         - class_id
 *         - title
 *         - description
 *         - due_date
 *       properties:
 *         assignment_id:
 *           type: integer
 *           description: The auto-generated ID of the assignment
 *         class_id:
 *           type: integer
 *           description: The ID of the class the assignment belongs to
 *         title:
 *           type: string
 *           description: The title of the assignment
 *         description:
 *           type: string
 *           description: The description of the assignment
 *         due_date:
 *           type: string
 *           format: date
 *           description: The due date of the assignment
 */

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: API for managing assignments
 */

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Returns the list of all the assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: The created assignment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Some server error
 */
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

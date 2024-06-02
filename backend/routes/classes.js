const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - class_id
 *         - class_name
 *         - professor_id
 *       properties:
 *         class_id:
 *           type: integer
 *           description: The auto-generated ID of the class
 *         class_name:
 *           type: string
 *           description: The name of the class
 *         professor_id:
 *           type: integer
 *           description: The ID of the professor teaching the class
 */

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: API for managing classes
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Returns the list of all the classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: The list of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       500:
 *         description: Some server error
 */
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

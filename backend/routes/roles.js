const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - role_id
 *         - role_name
 *       properties:
 *         role_id:
 *           type: integer
 *           description: The auto-generated ID of the role
 *         role_name:
 *           type: string
 *           description: The name of the role
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Returns the list of all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: The list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Some server error
 */
router.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Roles');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /roles:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '1234'; // Ensure this is the same as used in the tests

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - role_id
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         email:
 *           type: string
 *           description: The user's email
 *         role_id:
 *           type: integer
 *           description: The ID of the user's role
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role_id
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post('/register', async (req, res) => {
  const { username, password, email, role_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO Users (username, password, email, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, email, role_id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: A JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: User not found or invalid password
 *       500:
 *         description: Some server error
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign(
      { userId: user.user_id, roleId: user.role_id },
      SECRET_KEY,
      {
        expiresIn: '1h',
      },
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token missing
 *       500:
 *         description: Some server error
 */
router.get('/users', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const result = await pool.query('SELECT * FROM Users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

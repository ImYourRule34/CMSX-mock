const request = require('supertest');
const app = require('../server'); // Import the app from server.js
const pool = require('../db');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  // Clean tables before each test run
  console.log('Cleaning tables before tests...');
  await pool.query(`DELETE FROM Assignments`);
  await pool.query(`DELETE FROM Classes`);
  await pool.query(`DELETE FROM Users`);
  await pool.query(`DELETE FROM Roles`);

  // Insert initial test data
  console.log('Inserting initial test data...');
  const hashedPassword = await bcrypt.hash('password', 10);
  await pool.query(
    `INSERT INTO Roles (role_id, role_name) VALUES (1, 'admin'), (2, 'student'), (3, 'professor')`,
  );
  await pool.query(
    `INSERT INTO Users (user_id, username, password, email, role_id) VALUES (1, 'professor1', $1, 'professor1@example.com', 3)`,
    [hashedPassword],
  );
  await pool.query(
    `INSERT INTO Classes (class_id, class_name, professor_id) VALUES (1, 'Math 101', 1)`,
  );
});

afterAll(async () => {
  // Cleanup test data
  console.log('Cleaning up test data after tests...');
  await pool.query(`DELETE FROM Assignments`);
  await pool.query(`DELETE FROM Classes`);
  await pool.query(`DELETE FROM Users`);
  await pool.query(`DELETE FROM Roles`);
  await pool.end();
});

describe('CMSX API', () => {
  let token;

  beforeAll(async () => {
    console.log('Logging in to get token...');
    const res = await request(app).post('/api/login').send({
      username: 'professor1',
      password: 'password',
    });
    console.log('Login response:', res.body);
    token = res.body.token;
    console.log('Token received:', token);
  });

  it('should get all assignments', async () => {
    console.log('Making GET request to /api/assignments with token:', token);
    const res = await request(app)
      .get('/api/assignments')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response for GET /assignments:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new assignment', async () => {
    console.log('Making POST request to /api/assignments with token:', token);
    const res = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        class_id: 1,
        title: 'Assignment 1',
        description: 'Description for assignment 1',
        due_date: '2024-06-30',
      });
    console.log('Response for POST /assignments:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Assignment 1');
  });
});

const request = require('supertest');
const app = require('../server');
const pool = require('../db');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  console.log('Cleaning tables before tests...');
  await pool.query(`DELETE FROM Enrollments`);
  await pool.query(`DELETE FROM Grades`);
  await pool.query(`DELETE FROM Assignments`);
  await pool.query(`DELETE FROM Classes`);
  await pool.query(`DELETE FROM Users`);
  await pool.query(`DELETE FROM Roles`);

  console.log('Inserting initial test data...');
  const hashedPassword = await bcrypt.hash('password', 10);
  await pool.query(
    `INSERT INTO Roles (role_id, role_name) VALUES (1, 'admin'), (2, 'student'), (3, 'professor')`,
  );
  await pool.query(
    `INSERT INTO Users (user_id, username, password, email, role_id) VALUES (1, 'professor1', '${hashedPassword}', 'professor1@example.com', 3)`,
  );
  await pool.query(
    `INSERT INTO Classes (class_id, class_name, professor_id) VALUES (1, 'Math 101', 1)`,
  );
  await pool.query(
    `INSERT INTO Users (user_id, username, password, email, role_id) VALUES (2, 'student1', '${hashedPassword}', 'student1@example.com', 2)`,
  );
});

afterAll(async () => {
  console.log('Cleaning up test data after tests...');
  await pool.query(`DELETE FROM Enrollments`);
  await pool.query(`DELETE FROM Grades`);
  await pool.query(`DELETE FROM Assignments`);
  await pool.query(`DELETE FROM Classes`);
  await pool.query(`DELETE FROM Users`);
  await pool.query(`DELETE FROM Roles`);
  await pool.end();
});

describe('CMSX API - Enrollments', () => {
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

  it('should get all enrollments', async () => {
    console.log('Making GET request to /api/enrollments with token:', token);
    const res = await request(app)
      .get('/api/enrollments')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response for GET /enrollments:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new enrollment', async () => {
    console.log('Making POST request to /api/enrollments with token:', token);
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        student_id: 2,
        class_id: 1,
      });
    console.log('Response for POST /enrollments:', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('student_id', 2);
  });
});

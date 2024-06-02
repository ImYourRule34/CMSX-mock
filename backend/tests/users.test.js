const request = require('supertest');
const app = require('../server');  // Import the app from server.js
const pool = require('../db');

beforeAll(async () => {
  // Insert initial test data
  await pool.query(`INSERT INTO Roles (role_id, role_name) VALUES (1, 'admin'), (2, 'student'), (3, 'professor')`);
});

afterAll(async () => {
  // Cleanup test data
  await pool.query(`DELETE FROM Users`);
  await pool.query(`DELETE FROM Classes`);
  await pool.query(`DELETE FROM Roles`);
  await pool.end();
});

describe('CMSX API', () => {
  it('should respond with welcome message on /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Welcome to the CMSX API');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com',
        role_id: 1
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get all users with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    const token = loginRes.body.token;
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get all roles', async () => {
    const res = await request(app).get('/api/roles');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get all classes', async () => {
    const res = await request(app).get('/api/classes');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

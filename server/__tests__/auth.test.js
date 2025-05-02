const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Your Express app
const User = require('../models/user.model.js');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication', () => {
  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'Password123',
      name: 'Test User',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('user@example.com');
  });

  it('should not allow signup with existing email', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'Password123',
      name: 'Test User',
    });

    const res = await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'AnotherPass123',
      name: 'Test User 2',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'loginuser@example.com',
      password: 'Password123',
      name: 'Login User',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@example.com',
      password: 'Password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('loginuser@example.com');
  });

  it('should reject login with incorrect password', async () => {
    await request(app).post('/api/auth/signup').send({
      email: 'wrongpass@example.com',
      password: 'Password123',
      name: 'Wrong Pass',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@example.com',
      password: 'WrongPassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });
});

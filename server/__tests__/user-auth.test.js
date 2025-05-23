const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Your Express app
const User = require('../models/user.model.js');
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: '6.0.5' }  // or another known working version
  });
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

describe('GET /api/users/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'Test1234!'
    });
    token = res.body.token;
  });

  it('should return current authenticated user details', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
    expect(res.body.user).toHaveProperty('name', 'Test User');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });
});
describe('PUT /api/users/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'Password123!'
    });
    token = res.body.token;
  });

  it('should update user name and preferences', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Updated',
        preferences: {
          prediction_opt_in: false,
          preferred_brands: ['BrandY']
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Jane Updated');
    expect(res.body.user.preferences.prediction_opt_in).toBe(false);
    expect(res.body.user.preferences.preferred_brands).toContain('BrandY');
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).patch('/api/users/me').send({ name: 'NoAuth' });
    expect(res.statusCode).toBe(401);
  });
});
describe('DELETE /api/users/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'User To Delete',
      email: 'deleteuser@example.com',
      password: 'Password123!'
    });
    token = res.body.token;
  });

  it('should delete the authenticated user', async () => {
    const res = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User account deleted successfully');
  });

  it('should return 401 if no token provided', async () => {
    const res = await request(app).delete('/api/users/me');
    expect(res.statusCode).toBe(401);
  });
});

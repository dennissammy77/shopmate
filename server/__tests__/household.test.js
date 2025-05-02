const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model.js');
const Household = require('../models/household.model.js');

describe('POST /api/households', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app).post('/api/auth/signup').send({
            name: 'Household Creator',
            email: 'creator@example.com',
            password: 'Password123!'
        });
        token = res.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Household.deleteMany({});
    });

    it('should create a new household and assign the creator as a member', async () => {
        const res = await request(app)
        .post('/api/households')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'My Test Household' });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('My Test Household');
        expect(res.body.members.length).toBe(1);
    });

  it('should return 400 if household name is missing', async () => {
    const res = await request(app)
      .post('/api/households')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Household name is required');
  });
});
describe('GET /api/households/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Fetch User',
      email: 'fetch@example.com',
      password: 'Password123!'
    });
    token = res.body.token;

    await request(app)
      .post('/api/households')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Fetch Household' });
  });

  it('should return household details for the user', async () => {
    const res = await request(app)
      .get('/api/households/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Fetch Household');
    expect(res.body.members.length).toBeGreaterThan(0);
  });

  it('should return 404 if user has no household', async () => {
    const res2 = await request(app).post('/api/auth/signup').send({
      name: 'No Household User',
      email: 'nohouse@example.com',
      password: 'Password123!'
    });

    const noHouseToken = res2.body.token;

    const res = await request(app)
      .get('/api/households/me')
      .set('Authorization', `Bearer ${noHouseToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Household not found');
  });
});
describe('DELETE /api/households/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Delete User',
      email: 'delete@example.com',
      password: 'Password123!'
    });

    token = res.body.token;

    await request(app)
      .post('/api/households')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Delete Household' });
  });

  it('should delete the user\'s household and remove links from users', async () => {
    const res = await request(app)
      .delete('/api/households/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Household deleted successfully');

    const userRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(userRes.body.householdId).toBeNull();
  });

  it('should return 404 if household not found', async () => {
    const res = await request(app)
      .delete('/api/households/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Household not found');
  });
});

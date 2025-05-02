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

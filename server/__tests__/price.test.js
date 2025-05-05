const request = require('supertest');
const app = require('../app');

describe('GET /api/price/compare?itemName=', () => {
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
    });

    it('should return mock price comparisons for an item', async () => {
        const res = await request(app)
          .get('/api/price/compare?itemName=milk')
          .set('Authorization', `Bearer ${token}`);
      
        expect(res.statusCode).toBe(200);
        expect(res.body.itemName).toBe('milk');
        expect(res.body.prices.length).toBeGreaterThan(0);
    });      
});
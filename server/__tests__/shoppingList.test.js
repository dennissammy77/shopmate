const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user.model.js');
const Household = require('../models/household.model.js');
const ShoppingList = require('../models/ShoppingList.model.js');
const { generateToken } = require('../utils/jwt');

describe('POST /api/shopping-lists', () => {
  let token, user, household;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    user = await User.create({ email: 'test@example.com', passwordHash: 'hash', name: 'Test User' });
    household = await Household.create({ name: 'Test Home', members: [user._id] });
    token = generateToken(user._id);
  });

  afterAll(async () => {
    await User.deleteMany();
    await Household.deleteMany();
    await ShoppingList.deleteMany();
    await mongoose.disconnect();
  });

  it('should create a shopping list for a household', async () => {
    const res = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Weekly List',
        description: 'Groceries for the week',
        householdId: household._id,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Weekly List');
  });
});

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
describe('GET /api/shopping-lists', () => {
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
  
  it('should fetch all shopping lists for a household', async () => {
    // Create one list to ensure it exists
    await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Midweek List',
        description: 'Extra groceries',
        householdId: household._id,
      });
  
    const res = await request(app)
      .get(`/api/shopping-lists/${household._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
describe('GET /api/shopping-lists', () => {
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
  
  it('should fetch a specific shopping list by ID', async () => {
    const newList = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Target List',
        description: 'Shopping at Target',
        householdId: household._id,
      });
  
    const res = await request(app)
      .get(`/api/shopping-lists/list/${newList.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Target List');
  });  
});
describe('DELETE /api/shopping-lists', () => {
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
  
  it('should delete a specific shopping list by ID', async () => {
    const newList = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Target List',
        description: 'Shopping at Target',
        householdId: household._id,
      });
  
    const res = await request(app)
      .delete(`/api/shopping-lists/list/${newList.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Target List');
  });  
});
describe('POST /api/shopping-lists/list/:id/item/add', () => {
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
  
  it('should add an item to the shopping list', async () => {
    const newList = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Target List',
        description: 'Shopping at Target',
        householdId: household._id,
      });

    const res = await request(app)
      .post(`/api/shopping-lists/list/${newList.body._id}/item/add`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Milk',
        quantity: 2,
      });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].name).toBe('Milk');
  });
  
});
describe('PUT  /api/shopping-lists/list/:id/item/update', () => {
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
  
  it('should update an item in the shopping list', async () => {
    const newList = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Target List',
        description: 'Shopping at Target',
        householdId: household._id,
      });

    const newItem = await request(app)
      .post(`/api/shopping-lists/list/${newList.body._id}/item/add`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Milk',
        quantity: 2,
      });
    
    const itemId = newItem.body.items[0]._id
  
    const res = await request(app)
      .put(`/api/shopping-lists/list/${newList.body._id}/item/update`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        itemId,
        name: 'Almond Milk',
        quantity: 3
      });
  
    expect(res.statusCode).toBe(200);
    const updatedItem = res.body.items.find(i => i._id === itemId);
    expect(updatedItem.name).toBe('Almond Milk');
    expect(updatedItem.quantity).toBe(3);
  });
  
});
describe('PUT  /api/shopping-lists/list/:id/item/purchase', () => {
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
  
  it('should update an item in the shopping list', async () => {
    const newList = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Target List',
        description: 'Shopping at Target',
        householdId: household._id,
      });

    const newItem = await request(app)
      .post(`/api/shopping-lists/list/${newList.body._id}/item/add`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Milk',
        quantity: 2,
      });
    
    const itemId = newItem.body.items[0]._id
  
    const res = await request(app)
      .put(`/api/shopping-lists/list/${newList.body._id}/item/purchase`)
      .set('Authorization', `Bearer ${token}`)
      .send({ itemId });
  
    expect(res.statusCode).toBe(200);
    const updatedItem = res.body.items.find(i => i._id === itemId);
    expect(updatedItem.status).toBe('purchased');
  });
  
});

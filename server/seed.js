const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// Import your existing models or define them here if needed
const User = require('./models/user.model.js');
const Household = require('./models/household.model.js');
const ShoppingList = require('./models/shoppingList.model.js');
const db = require("./config/database.js");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
// initialize the db
db.connect();

const NUM_HOUSEHOLDS = 100;
const LISTS_PER_HOUSEHOLD = 50;

async function seedDb() {
  try {
    await User.deleteMany({});
    await Household.deleteMany({});
    await ShoppingList.deleteMany({});

    const allUsers = [];

    for (let i = 0; i < NUM_HOUSEHOLDS; i++) {
      const household = new Household({ name: `Household_${i}` });
      await household.save();

      // Create 2 to 5 users per household
      const householdUsers = [];

      const numUsers = faker.number.int({ min: 2, max: 5 });
      for (let j = 0; j < numUsers; j++) {
        const user = new User({
          email: faker.internet.email().toLowerCase(),
          passwordHash: await bcrypt.hash('password123', 10),
          name: faker.person.fullName(),
          householdId: household._id,
          preferences: {
            prediction_opt_in: faker.datatype.boolean(),
            preferred_brands: faker.helpers.arrayElements(['BrandA', 'BrandB', 'BrandC', 'BrandD'], 2)
          }
        });

        await user.save();
        householdUsers.push(user._id);
        allUsers.push(user);
      }

      household.members = householdUsers;
      await household.save();

      // Create 50 shopping lists per household
      for (let k = 0; k < LISTS_PER_HOUSEHOLD; k++) {
        const createdByUser = faker.helpers.arrayElement(householdUsers);

        const shoppingList = new ShoppingList({
          name: `List_${k}_H${i}`,
          description: faker.lorem.sentence(),
          householdId: household._id,
          createdBy: createdByUser,
          items: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(() => {
            const modifyingUser = faker.helpers.arrayElement(householdUsers);
            return {
                name: faker.commerce.productName(),
                quantity: faker.number.int({ min: 1, max: 5 }),
                status: faker.helpers.arrayElement(['pending', 'purchased']),
                lastModifiedBy: modifyingUser,
                priceInfo: {
                    storeName: faker.company.name(),
                    price: parseFloat(faker.commerce.price()),
                    currency: 'ILS',
                    lastChecked: faker.date.recent(),
                },
                history: [
                    {
                    action: faker.helpers.arrayElement(['add', 'edit', 'delete', 'purchase']),
                    timestamp: faker.date.recent(),
                    userId: modifyingUser,
                    },
                ],
            };
          }),
        });

        await shoppingList.save();
      }

      console.log(`✅ Household ${i + 1} with users and lists created`);
    }

    console.log('🎉 Mock data generation complete!');
  } catch (error) {
    console.error('Error generating mock data:', error);
  }
};

module.exports = seedDb
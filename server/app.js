const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const db = require("./config/database.js");
// Load environment variables from .env file
dotenv.config();
// initialize the db
db.connect();
// middlewares
const authMiddleware = require('./middlewares/authMiddleware.js');
// controllers
const authRoutes = require('./controllers/auth.controller.js');
const userRoutes = require('./controllers/user.controller.js');
const householdsRoutes = require('./controllers/household.controller.js');
const shoppinglistRoutes = require('./controllers/shoppingList.controller.js');
const priceRoutes = require('./controllers/price.controller.js');
const protectedRoutes = require('./controllers/protected.controller.js');
const seedDb = require('./seed.js')


app.use(express.json());

app.use(cors({
	credentials: true,
	origin: '*'
}));

/**************************ENDPOINTS**************************************/
app.get('/',(req,res)=>{
    return res.send('Hello World!!')
})

/**************************ROUTES********************************/
// Protected routes group
// const protectedRouter = express.Router();
// protectedRouter.use(authMiddleware);

// protectedRouter.use('/users', userRoutes);
// protectedRouter.use('/households', householdsRoutes);
// protectedRouter.use('/shopping-lists', shoppinglistRoutes);
// protectedRouter.use('/price', priceRoutes);
// // Use routers
// app.use('/api', protectedRouter); // All protected routes

app.get('/api/seed', (req,res)=>{
	seedDb();
	return res.status(200).send('Data successfully seeded')
});
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/households', authMiddleware, householdsRoutes);
app.use('/api/shopping-lists', authMiddleware, shoppinglistRoutes);
app.use('/api/price', authMiddleware, priceRoutes);
app.use('/api/protected', protectedRoutes);

module.exports = app;
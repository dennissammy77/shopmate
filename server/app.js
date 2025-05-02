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
const protectedRoutes = require('./controllers/protected.controller.js');


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
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/protected', protectedRoutes);


module.exports = app;
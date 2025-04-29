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
// controllers

app.use(express.json());

app.use(cors({
	credentials: true,
	origin: '*'
}));

/**************************ENDPOINTS**************************************/
app.get('/',(req,res)=>{
    return res.send('Hello World!!')
})

/**************************NAVIGATION********************************/

module.exports = app;
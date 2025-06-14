const mongoose = require("mongoose");
require('dotenv').config();
const LOGGER = require("../lib/LOGGER.lib.js");

const username = encodeURIComponent(process.env.MONGO_URI_DEV_USERNAME);
const password = encodeURIComponent(process.env.MONGO_URI_DEV_PASSWORD);
const connection_endpoint = process.env.MONGO_URI_DEV_CONNECTION_ENDPOINT
const connectionString = `mongodb+srv://${username}:${password}@${connection_endpoint}`;

exports.connect=()=>{
	mongoose.connect(connectionString).then(()=>{
		LOGGER.log('info',`Db connected successfully!${connectionString}`);
	}).catch((err)=>{
		LOGGER.log('error',`Error while connecting database!\n${err}`);
		throw new Error('Error while connecting database')
	})
};
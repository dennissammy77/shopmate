const mongoose = require("mongoose");
require('dotenv').config();
const username = encodeURIComponent(process.env.MONGO_URI_DEV_USERNAME);
const password = encodeURIComponent(process.env.MONGO_URI_DEV_PASSWORD);
const connection_endpoint = process.env.MONGO_URI_DEV_CONNECTION_ENDPOINT
const connectionString = `mongodb+srv://${username}:${password}@${connection_endpoint}`;

exports.connect=()=>{
	mongoose.connect(connectionString).then(()=>{
		console.log('Db connected successfully!');
	}).catch((err)=>{
		console.log(err);
		throw new Error('Error while connecting database')
	})
}
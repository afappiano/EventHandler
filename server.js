// Get values from .env file
require('dotenv').config();

// Express
const express = require('express');
const app = express();

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB
const mongodb = require('mongodb');
let db;
mongodb.MongoClient.connect(process.env['MONGO_URL']).then((mongo, err) => {
	if(err) throw err;
	else{
		db = mongo.db(process.env['MONGO_DB']);
		console.log("Database connected");

		// Start listening once the database has been connected
		app.listen(process.env['PORT'], () => console.log('Server started on port ' + process.env['PORT']));
	}
});

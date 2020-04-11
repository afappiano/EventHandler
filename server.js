// Get values from .env file
require('dotenv').config();

// Express
const express = require('express');
const app = express();

// Serve static files from public directory
app.use(express.static('public'));

// Parse responses as JSON
app.use(express.json());

// API Routes
app.post('/api/user/register', (req, res) => {

	let email = req.body['email'];
	let password = req.body['password'];

	// Check if email is present
	if(email === undefined){
		res.status(400).send({
			error: "Missing email"
		});
	}
	// Check if password is present
	else if(password === undefined){
		res.status(400).send({
			error: "Missing password"
		});
	}
	else{
		// Check if password meets requirements (At least 12 characters)
		if(password.length < 12){
			res.status(400).send({
				error: "Password is too short"
			});
		}
		// Check if email is available
		else if(db.collection("users").countDocuments({email:email}) > 0){
			res.status(400).send({
				error: "Email is not available"
			});
		}
		// Create account
		else{
			res.sendStatus(200);
		}
	}
});

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
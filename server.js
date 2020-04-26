// Get values from .env file
require('dotenv').config();

const bcrypt = require('bcrypt');

// Express
const express = require('express');
const app = express();

// Express Session
const express_session = require('express-session');
const connect_mongo = require('connect-mongo')(express_session);
app.use(express_session({
	cookie: {
		maxAge: 3600000
	},
	name: "eh_session",
	rolling: true,
	secret: "cactus",
	store: new connect_mongo({
		url: process.env['MONGO_URL'],
		dbName: process.env['MONGO_DB']
	})
}));

// Serve static files from public directory
app.use(express.static('public'));

// Parse responses as JSON
app.use(express.json());

// API Routes
app.post('/api/user/register', (req, res) => {

	let email = req.body['email'];
	let password = req.body['password'];

	// Check if email is present TODO: check if email is valid (and don't accept blank emails)
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
		}else{
			// Check if email is available
			db.collection('users').countDocuments({email:email}).then((result) => {
				if(result > 0){
					res.status(400).send({
						error: "Email is not available"
					});
				}else{
					// Create the account if it is
					bcrypt.hash(password, 10, (err, hash) => {
						if(err){
							res.status(500).send({
								error: "Failed to hash password"
							});
							throw err;
						}else{
							db.collection('users').insertOne({
								email: email,
								password: hash
							}).then(() => {
								res.sendStatus(200);
							}).catch((err) => {
								res.status(500).send({
									error: "Failed to insert user into database"
								});
								throw err;
							});
						}
					});
				}
			}).catch((err) => {
				res.status(500).send({
					error: "Failed to check if email is available"
				});
			});
		}
	}

});
app.post('/api/user/login', ((req, res) => {

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
	}else{
		// Get hash from database
		db.collection('users').findOne({email:email}, (err, database_result) => {
			if(err){
				res.status(500).send({
					error: "Error talking to database"
				});
			}else{
				if(database_result === null){
					res.status(401).send({
						error: "Invalid credentials"
					});
				}else{
					bcrypt.compare(password, database_result['password'], (err, compare_result) => {
						if(err){
							res.status(500).send({
								error: "Error comparing password hash"
							});
						}else if(compare_result){
							// Login successful
							req.session.regenerate((err_regen) => {
								if(err_regen){
									res.status(500).send({
										error: "Error regenerating session"
									});
								}
								req.session['userID'] = database_result['_id'];
								res.sendStatus(200);
							});
						}else{
							res.status(401).send({
								error: "Invalid credentials"
							});
						}
					});
				}
			}
		});
	}

}));
app.get('/api/user/logout', (req, res) => {

	req.session.destroy((err) => {
		if(err) res.status(500).send({
			error: "Failed to destroy session"
		});
		else{
			res.sendStatus(200);
		}
	});

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
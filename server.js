// Get values from .env file
require('dotenv').config();

const bcrypt = require('bcrypt');
const bson = require('bson');

// Express
const express = require('express');
const app = express();
var ObjectID = require('mongodb').ObjectID;
var bp = require('body-parser');
app.use(bp.urlencoded({ extended: true }));

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

// Middleware for login session stuff
app.use((req, res, next) => {

	req.isLoggedIn = function(){
		return req.session['userID'] !== undefined;
	}

	// Callback takes two parameters: err and user
	req.getCurrentUser = function(callback){
		if(!req.isLoggedIn()){
			res.status(401).send({
				error: "Not logged in"
			});
			if(typeof callback == 'function') callback(new Error("Not logged in"));
		}else{
			db.collection('users').findOne({_id:bson.ObjectId(req.session['userID'])}, {projection: {_id: true, email: true}}, (err, result) => {
				if(err) return callback(err);
				else{
					if(typeof callback == 'function') callback(null, result);
				}
			});
		}
	}

	next();
});

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

// create new event
app.post('/api/events/new', (req, res) => {
	// console.log(req);

  var event = req.body;
  var currentuser = '';

	
	// console.log(currentuser);

	if(event.name == ""){
		res.status(400).send({
			error: "Missing name"
		});
	}
	else if(event.desc == ""){
		res.status(400).send({
			error: "Missing description"
		});
  }
	else if(event.time == ""){
		res.status(400).send({
			error: "Missing time"
		});
  }
  else if(event.loc == ""){
		res.status(400).send({
			error: "Missing location"
		});
  }
  else {

  	req.getCurrentUser((err, user) => {
		// If the user is not logged in 401 will be returned and user won't be passed to the callback
		if(user){
			// res.send(user);
			currentuser = user['email'];
			// console.log(currentuser);

			var new_event = {
			  user: currentuser,
		      name: event.name,
		      desc: event.desc,
		      time: event.time,
		      loc: event.loc,
			  attendees: event.attendees,
			  map: {
				  components: event.map.components,
				  labels: event.map.labels
			  }
			};
		    db.collection("events").insertOne(new_event, function(err, result) {
		      if (err) throw err;
					res.status(200).send({message:"Event inserted"});
		    });
		}
	});
  	

  }


});

// edit event
app.post('/api/events/edit', (req, res) => {
	var event = req.body;
	var currentuser = '';

	

	if(event.name == ""){
		res.status(400).send({
			error: "Missing name"
		});
	}
	else if(event.desc == ""){
		res.status(400).send({
			error: "Missing description"
		});
  }
	else if(event.time == ""){
		res.status(400).send({
			error: "Missing time"
		});
  }
  else if(event.loc == ""){
		res.status(400).send({
			error: "Missing location"
		});
  }
  else {
	var searchid = { _id: ObjectID(event._id) }

	req.getCurrentUser((err, user) => {
		// If the user is not logged in 401 will be returned and user won't be passed to the callback
		if(user){
			// res.send(user);
			currentuser = user['email'];
			// console.log(user);
		}

		var changes = {
		  user: currentuser,
	      name: event.name,
	      desc: event.desc,
	      time: event.time,
	      loc: event.loc,
		  attendees: event.attendees,
		  map: {
			components: event.map.components,
			labels: event.map.labels
		  }
		};
	    db.collection("events").updateOne(searchid, changes, function(err, result) {
	      	if (err) throw err;
				res.status(200).send({message:"Event updated"});
	    });
	});
	
  }
});

// get current user's events
app.get('/api/events/hosting', (req, res) => {

	var currentuser = '';

	req.getCurrentUser((err, user) => {
		// If the user is not logged in 401 will be returned and user won't be passed to the callback
		if(user){
			// res.send(user);
			currentuser = user['email'];
			// console.log("??????" + currentuser);
			db.collection("events").find({ "user" : currentuser }).sort({"time":-1}).toArray(function(err, result) {
		        if (err) throw err;
		        else {
		          // console.log(result);
		          res.status(200).send(result);
		        }
			});
		}
	});

	
});

// get current user's invites
app.get('/api/events/invited', (req, res) => {
	var currentuser = '';

	req.getCurrentUser((err, user) => {
		// If the user is not logged in 401 will be returned and user won't be passed to the callback
		if(user){
			// res.send(user);
			currentuser = user['email'];
			// console.log("??????" + currentuser);
			db.collection("events").find({ "attendees" : { $elemMatch: { "email" : currentuser, "status" : "Pending"} } }).sort({"time":-1}).toArray(function(err, result) {
		        if (err) throw err;
		        else {
		          // console.log(result);
		          res.status(200).send(result);
		        }
			});
		}
	});
});

// Example route that checks if a user is logged in and if they are, returns their info, otherwise returns 401 with an error message
app.get('/s3cr3t', (req, res) => {

	req.getCurrentUser((err, user) => {
		// If the user is not logged in 401 will be returned and user won't be passed to the callback
		if(user){
			res.send(user);
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
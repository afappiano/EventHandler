// Get values from .env file
require('dotenv').config();

// Express
const express = require('express');
const app = express();
var ObjectID = require('mongodb').ObjectID;
var bp = require('body-parser');
app.use(bp.urlencoded({ extended: true })); 

// Serve static files from public directory
app.use(express.static('public'));

// Parse responses as JSON
app.use(express.json());

// API Routes

// OLD REGISTER
app.post('/api/user/register', (req, res) => {

	let email = req.body['email'];
	let password = req.body['password'];

	// Check if email is present
	if(email == ""){
		res.status(400).send({
			error: "Missing email"
		});
	}
	// Check if password is present
	else if(password == ""){
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
			// res.sendStatus(200);
			db.collection("users").insertOne(req.body, function(err, result) {
				if (err) throw err;
				// res.status(200).send({message:"User inserted"});
				res.status(200).send('manage');
			});
	
		}
	}
});


// NEW REGISTER / LOGIN
//==========================================================================
app.post('/api/user/test', (req, res) => {

	// console.log(req.body);

	var login = req.body.login == "Login"; // login variable will either be 'Login' or 'Sign up'

	var email = req.body.email;
	var password = req.body.password;


	// Check if email is present
	if(email == ""){
		res.status(400).send({
			error: "Missing email"
		});
	}
	// Check if password is present
	else if(password == ""){
		res.status(400).send({
			error: "Missing password"
		});
	}

	if(login == false){		// REGISTER
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
			var user = Object.create(null);
			user.email = email;
			user.password = password;

			// console.log(user);
			db.collection("users").insertOne(user, function(err, result) {
				if (err) throw err;
				res.status(200).send({message:"User inserted"});
				// res.status(200).send('/manage'); // this doesn't work
			});
	
		}
	} else { // LOGIN - unfinished
		if(db.collection("users").countDocuments({email:email}) == 0){
			res.status(400).send({
				error: "Username or password is incorrect"
			});
		}
	}

});
//==========================================================================




// create new event
app.post('/api/events/new', (req, res) => {
	// console.log(req);

  var event = req.body;

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
    db.collection("events").insertOne(event, function(err, result) {
      if (err) throw err;
			res.status(200).send({message:"Event inserted"});
    });

  }

  
});

// edit event
app.post('/api/events/edit', (req, res) => {
	var event = req.body;
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
	var changes = { $set: {
      name: event.name,
      desc: event.desc,
      time: event.time,
      loc: event.loc,
      attendees: event.attendees
	}}
    db.collection("events").updateOne(searchid, changes, function(err, result) {
      	if (err) throw err;
			res.status(200).send({message:"Event updated"});
    });
  }
});

// get current user's events
app.get('/api/events/hosting', (req, res) => {
	db.collection("events").find({ /*"user" : currentuser*/ }).sort({"time":-1}).toArray(function(err, result) {
        if (err) throw err;
        else {
          // console.log(result);
          res.status(200).send(result);
        }
	});
});

// get current user's invites
app.get('/api/events/invited', (req, res) => {
	
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
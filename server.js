// Get values from .env file
require('dotenv').config();

// Express
const express = require('express');
const app = express();

// Serve static files from public directory
app.use(express.static('public'));

// Start listening
app.listen(process.env['PORT'], () => console.log('Server started on port ' + process.env['PORT']));
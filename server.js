// Express
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Start listening
app.listen(port, () => console.log('Server started on port ' + port));




const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');

// Connect to the database
dbConnect();

// Initialize the Express application
const app = express();

//middleware
app.use(express.json());

//routes

//start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
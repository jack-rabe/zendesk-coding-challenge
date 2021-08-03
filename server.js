const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
// load environment variables
require('dotenv').config();
// load all routes
const homeRoute = require('./routes/home.js');
const ticketPageRoute = require('./routes/ticketPage.js');
const manyTicketsRoute = require('./routes/manyTickets.js');
// load error handling middleware
const errorHandler = require('./errorHandler.js');

const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));
// initialize session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false,
	})
);
// log requests
app.use(morgan(':method :url :status'));
// mount all of the routes
app.use('/', homeRoute);
app.use('/ticketPage', ticketPageRoute);
app.use('/manyTickets', manyTicketsRoute);
// set messages and status codes for all errors
app.use(errorHandler);

module.exports = app;

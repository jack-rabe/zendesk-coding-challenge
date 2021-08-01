const path = require('path');
const express = require('express');
const session = require('express-session');
// load environment variables
require('dotenv').config();
// load all routes
const homeRoute = require('./routes/home.js');
const individualTicketRoute = require('./routes/individualTicket.js');
const ticketPageRoute = require('./routes/ticketPage.js');
const manyTicketsRoute = require('./routes/manyTickets.js');

const app = express();
const port = 3000;
app.use(express.static(path.resolve(__dirname, 'public')));
// initialize session
app.use(
	session({
		// the secret is substituted since the .env file is stored on my computer
		secret: process.env.SESSION_SECRET || 'secret',
		resave: true,
		saveUninitialized: false,
	})
);
// mount all of the routes
app.use('/', homeRoute);
app.use('/ticket', individualTicketRoute);
app.use('/ticketPage', ticketPageRoute);
app.use('/manyTickets', manyTicketsRoute);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

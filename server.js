const getTickets = require('./getTickets.js');
const path = require('path');
const express = require('express');
const session = require('express-session');
// load environment variables
require('dotenv').config();

const app = express();
const port = 3000;
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false,
	})
);

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/data', async (req, res) => {
	const data = await getTickets();
	req.session.tickets = data.tickets;
	req.session.numTickets = data.numTickets;
	res.json(JSON.stringify(data));
});

app.get('/page/:pageNumber', (req, res) => {
	const tickets = req.session.tickets;
	const startingIdx = req.params.pageNumber * 25 - 25;
	const endingIdx = Math.min(startingIdx + 25, tickets.length);
	res.json(JSON.stringify(tickets.slice(startingIdx, endingIdx)));
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// revisit scrolling properties of the main section
// make buttons the same size regardless of the text size
// remove pixel hardcoding where possible (use em?)
// add headers to the ticket section
// handling null values for ticket sections????
// webpack bundling for css???
// add status codes?
// is this needed to parse body requests? app.use(express.json());
// make sure to handle wrongful requests for tickets that don't exist
// note: express sessions are not secure for production
// make sure there are still more tickets to get for next and previous buttons
// make a better default display for the individual ticket div
// you must put Accept: application/json on al requests???
// make the tickets have a consistent ID size

app.get('/ticket/:ticketID', (req, res) => {
	const tickets = req.session.tickets;
	const ticketID = req.params.ticketID;
	const ticketToGet = tickets.find((ticket) => ticket.id == ticketID);
	res.json(JSON.stringify(ticketToGet));
});

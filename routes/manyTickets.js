const getTickets = require('../getTickets.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	const data = await getTickets();
	req.session.tickets = data.tickets;
	req.session.numTickets = data.numTickets;
	res.json(JSON.stringify(data));
});

module.exports = router;

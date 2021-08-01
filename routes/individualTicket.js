const express = require('express');
const router = express.Router();

router.get('/:ticketID', (req, res) => {
	const tickets = req.session.tickets;
	const ticketID = req.params.ticketID;
	const ticketToGet = tickets.find((ticket) => ticket.id == ticketID);
	res.json(JSON.stringify(ticketToGet));
});

module.exports = router;

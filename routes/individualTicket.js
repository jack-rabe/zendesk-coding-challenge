const express = require('express');
const router = express.Router();

router.get('/:ticketID', (req, res, next) => {
	const ticketID = req.params.ticketID;
	try {
		const tickets = req.session.tickets;
		const ticketToGet = tickets.find((ticket) => ticket.id == ticketID);
		res.send(ticketToGet);
	} catch (err) {
		next(`Ticket #${ticketID} cannot be found`);
	}
});

module.exports = router;

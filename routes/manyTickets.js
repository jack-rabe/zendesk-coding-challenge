const getTickets = require('../getTickets.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const data = await getTickets();
		req.session.tickets = data.tickets;
		req.session.numTickets = data.numTickets;
		res.status(200);
		res.send(data);
	} catch (err) {
		next({
			errorMsg:
				'The tickets could not be retrieved from the Zendesk servers. Please try again.',
			statusCode: 404,
		});
	}
});

module.exports = router;

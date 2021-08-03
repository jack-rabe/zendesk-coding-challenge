const express = require('express');
const router = express.Router();

router.get('/:pageNumber', (req, res, next) => {
	try {
		const tickets = req.session.tickets;
		const startingIdx = req.params.pageNumber * 25 - 25;
		const endingIdx = Math.min(startingIdx + 25, tickets.length);
		res.status(200).send(tickets.slice(startingIdx, endingIdx));
	} catch (err) {
		next({
			errorMsg: `Page #${req.params.pageNumber} could not be retrieved. Please try again.`,
			statusCode: 500,
		});
	}
});

module.exports = router;

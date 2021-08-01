const express = require('express');
const router = express.Router();

router.get('/:pageNumber', (req, res) => {
	const tickets = req.session.tickets;
	const startingIdx = req.params.pageNumber * 25 - 25;
	const endingIdx = Math.min(startingIdx + 25, tickets.length);
	res.json(JSON.stringify(tickets.slice(startingIdx, endingIdx)));
});

module.exports = router;

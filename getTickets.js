const btoa = require('btoa');
const fetch = require('node-fetch');
// load environment variables
require('dotenv').config();
const username = process.env.ZENDESK_USERNAME;
const apiToken = process.env.ZENDESK_API_KEY;

// loads all of the user's tickets into express session storage in MemoryStore
const getTickets = async () => {
	const url = 'https://zccjrabe.zendesk.com/api/v2/tickets';
	const encodedAuth = btoa(`${username}/token:${apiToken}`);
	const tickets = [];

	// initial request
	let response = await fetchData(url, encodedAuth);
	const numTickets = response.count;
	response.tickets.forEach((ticketData) =>
		tickets.push(createTicket(ticketData))
	);
	// additional requests if there are additional pages of tickets
	while (response.next_page) {
		response = await fetchData(response.next_page, encodedAuth);
		response.tickets.forEach((ticketData) =>
			tickets.push(createTicket(ticketData))
		);
	}

	return { numTickets, tickets };
};

async function fetchData(url, auth) {
	let response = await fetch(url, {
		headers: {
			Authorization: `Basic ${auth}`,
			Accept: 'application/json',
		},
	});
	response = await response.json();
	return response;
}

// condense the information from the tickets by removing unnecessary attributes
function createTicket(ticketData) {
	const timeInSeconds = Date.parse(ticketData.created_at);
	const timeString = new Date(timeInSeconds).toLocaleString('en-US', {
		timeZoneName: 'short',
	});

	return {
		id: ticketData.id,
		priority: ticketData.priority,
		subject: ticketData.subject,
		recipient: ticketData.recipient,
		description: ticketData.description,
		tags: ticketData.tags,
		time: timeString,
	};
}

module.exports = { getTickets, createTicket };

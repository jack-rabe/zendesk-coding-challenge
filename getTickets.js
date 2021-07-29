const btoa = require('btoa');
const fetch = require('node-fetch');
// load environment variables (username and api key)
require('dotenv').config();
const username = process.env.ZENDESK_USERNAME;
const apiToken = process.env.ZENDESK_API_KEY;

const getTickets = async () => {
	const url = 'https://zccjrabe.zendesk.com/api/v2/tickets';
	const encodedAuth = btoa(`${username}/token:${apiToken}`);
	const tickets = [];

	// initial request
	let response = await fetchData(url, encodedAuth);
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

	return response;
};

async function fetchData(url, auth) {
	let response = await fetch(url, {
		headers: {
			Authorization: `Basic ${auth}`,
		},
	});
	response = await response.json();
	return response;
}

function createTicket(obj) {
	return {
		id: obj.id,
		priority: obj.priority,
		subject: obj.subject,
		recipient: obj.recipient,
		description: obj.description,
	};
}

module.exports = getTickets;

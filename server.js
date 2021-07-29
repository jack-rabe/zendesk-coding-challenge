const fetch = require('node-fetch');
const btoa = require('btoa');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));
const port = 3000;

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// load environment variables (username and api key)
require('dotenv').config();
const username = process.env.ZENDESK_USERNAME;
const apiToken = process.env.ZENDESK_API_KEY;

async function getTickets() {
	const url = 'https://zccjrabe.zendesk.com/api/v2/tickets';
	const encodedAuth = btoa(`${username}/token:${apiToken}`);

	let response = await fetch(url, {
		headers: {
			Authorization: `Basic ${encodedAuth}`,
		},
	});
	response = await response.json();
	return response;
}

app.get('/data', async (req, res) => {
	const data = await getTickets();
	const json = JSON.stringify(data);
	res.json(json);
});

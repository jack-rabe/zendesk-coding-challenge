const getTickets = require('./getTickets.js');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));
const port = 3000;

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/data', async (req, res) => {
	const data = await getTickets();
	const json = JSON.stringify(data);
	res.json(json);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

console.log('JS file served');

const storage = window.sessionStorage;

const button = document.getElementById('data-button');
button.onclick = async () => {
	let data = await fetch('/data');
	data = await data.json();
	data = JSON.parse(data);
	console.log(data);

	let tickets = data.tickets;
	// tickets.forEach((ticket) => {
	// 	console.log(ticket.priority);
	// });
	createTicketElement(tickets[0]);
};

function createTicketElement(ticket) {
	const ticketContainer = document.getElementById('ticket-container');
	const ticketElement = document.createElement('div');
	ticketElement.classList.add('ticket');

	let ticketColor;
	switch (ticket.priority) {
		case 'low':
			ticketColor = 'green';
			break;
		case 'normal':
		case null:
			ticketColor = 'blue';
			break;
		case 'high':
			ticketColor = 'yellow';
			break;
		case 'urgent':
			ticketColor = 'red';
			break;
		default:
			ticketColor = 'pink';
	}

	ticketElement.textContent = ticket.description;
	ticketElement.style.backgroundColor = ticketColor;

	ticketContainer.appendChild(ticketElement);
}

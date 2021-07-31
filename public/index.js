const storage = window.sessionStorage;

const button = document.getElementById('data-button');
button.onclick = async () => {
	let response = await fetch('/data');
	response = await response.json();
	response = JSON.parse(response);

	const tickets = response.tickets;
	const numTickets = response.numTickets;
	console.log(tickets);
	console.log(numTickets);
	//const tickets = exampleTickets;

	for (let i = 0; i < 25; i++) {
		createTicketElement(tickets[i]);
	}
};

function createTicketElement(ticket) {
	const ticketContainer = document.getElementById('ticket-container');
	const ticketElement = document.createElement('div');
	ticketElement.classList.add('ticket');

	createTicketSection(ticketElement, 'id', ticket.id);
	createTicketSection(ticketElement, 'title', ticket.subject);
	// set a default priority of normal when none exists
	const priorityElement = createTicketSection(
		ticketElement,
		'priority',
		ticket.priority || 'normal'
	);
	priorityElement.style.color = getTicketColor(ticket.priority);
	createTicketSection(ticketElement, 'time', ticket.time);

	ticketContainer.appendChild(ticketElement);
}

function createTicketSection(parentContainer, elementClass, text) {
	const element = document.createElement('div');
	element.classList.add(elementClass);
	element.textContent = text;

	parentContainer.appendChild(element);
	return element;
}

function getTicketColor(priority) {
	switch (priority) {
		case 'low':
			return 'green';
		case 'normal':
		case null:
			return 'blue';
		case 'high':
			return 'yellow';
		case 'urgent':
			return 'red';
		default:
			return 'pink';
	}
}

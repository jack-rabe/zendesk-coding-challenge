const storage = window.sessionStorage;

const nextButton = document.getElementById('next-button');
const previousButton = document.getElementById('previous-button');

window.onload = async () => {
	let pageNumber;
	// set page number to 1 on initial load and fetch all tickets
	if (!storage.pageNumber) {
		// load all the data into the express session
		let response = await fetch('/manyTickets');
		response = await response.json();
		response = JSON.parse(response);

		// load the page number and number of tickets into session storage
		storage.setItem('pageNumber', '1');
		storage.setItem('numTickets', response.numTickets);
		pageNumber = 1;
	}
	// tickets don't need to be loaded because they are already in storage
	else {
		pageNumber = storage.pageNumber;
	}

	const tickets = await fetchPageofTickets(pageNumber);
	for (let i = 0; i < tickets.length; i++) {
		createTicketElement(tickets[i]);
	}
	const individualTicket =
		JSON.parse(storage.getItem('currentTicket')) || tickets[0];
	displayIndividualTicket(individualTicket);
};

nextButton.onclick = async () => {
	const currentPageNumber = +storage.getItem('pageNumber');
	const nextPageNumber = currentPageNumber + 1;
	if (currentPageNumber * 25 >= storage.numTickets) {
		return;
	}

	const tickets = await fetchPageofTickets(nextPageNumber);
	clearPreviousTickets();
	for (let i = 0; i < tickets.length; i++) {
		createTicketElement(tickets[i]);
	}
	// update page number to session storage
	storage.setItem('pageNumber', nextPageNumber);
};
previousButton.onclick = async () => {
	const nextPageNumber = +storage.getItem('pageNumber') - 1;
	if (nextPageNumber <= 0) {
		return;
	}

	const tickets = await fetchPageofTickets(nextPageNumber);
	clearPreviousTickets();
	for (let i = 0; i < tickets.length; i++) {
		createTicketElement(tickets[i]);
	}
	// update the page number to session storage
	storage.setItem('pageNumber', nextPageNumber);
};

async function fetchPageofTickets(pageNumber) {
	let tickets = await fetch(`ticketPage/${pageNumber}`);
	tickets = await tickets.json();
	return JSON.parse(tickets);
}

async function displayIndividualTicket(ticket) {
	const subjectElement = document.getElementById('ticket-subject');
	const idElement = document.getElementById('ticket-id');
	const descriptionElement = document.getElementById('ticket-description');
	const tagsElement = document.getElementById('ticket-tags');
	const timeElement = document.getElementById('ticket-time');

	let response = await fetch(`/ticket/${ticket.id}`);
	response = await response.json();
	response = JSON.parse(response);

	subjectElement.textContent = response.subject;
	idElement.textContent = response.id;
	descriptionElement.textContent = response.description;
	tagsElement.textContent = `Tags: ${response.tags.join(', ')}`;
	timeElement.textContent = `Created at: ${response.time}`;
}

function createTicketElement(ticket) {
	const ticketContainer = document.getElementById('ticket-container');
	const ticketElement = document.createElement('div');
	ticketElement.classList.add('ticket');

	createTicketSection(ticketElement, 'id', ticket.id);
	createTicketSection(ticketElement, 'subject', ticket.subject);
	// set a default priority of normal when none exists
	const priorityElement = createTicketSection(
		ticketElement,
		'priority',
		ticket.priority || 'normal'
	);
	priorityElement.style.color = getTicketColor(ticket.priority);
	createTicketSection(ticketElement, 'time', ticket.time);

	ticketElement.onclick = () => {
		displayIndividualTicket(ticket);
		storage.setItem('currentTicket', JSON.stringify(ticket));
	};

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

function clearPreviousTickets() {
	const ticketContainer = document.getElementById('ticket-container');
	const tableHeader = document.getElementById('table-header');
	while (ticketContainer.firstChild) {
		ticketContainer.removeChild(ticketContainer.firstChild);
	}
	// retain the header that specifies the properties of the table
	ticketContainer.appendChild(tableHeader);
}

// const dataButton = document.getElementById('data-button');
// // load all ticket data and display the first 25 tickets on the first page
// dataButton.onclick = async () => {
// 	let response = await fetch('/data');
// 	response = await response.json();
// 	response = JSON.parse(response);

// 	storage.setItem('numTickets', response.numTickets);
// 	// set page number to 1 on initial load
// 	storage.setItem('pageNumber', '1');
// 	const tickets = await fetchPageofTickets(1);

// 	for (let i = 0; i < tickets.length; i++) {
// 		createTicketElement(tickets[i]);
// 	}
// 	displayIndividualTicket(tickets[0]);
// };

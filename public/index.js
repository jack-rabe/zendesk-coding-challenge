const storage = window.sessionStorage;
const nextButton = document.getElementById('next-button');
const previousButton = document.getElementById('previous-button');

nextButton.onclick = updatePage.bind(null, 1);
previousButton.onclick = updatePage.bind(null, -1);
window.onload = async () => {
	try {
		let pageNumber;
		// load all the data into the express session
		let response = await fetchAllTicketData();
		// set page number to 1 on initial load and set number of tickets in session storage
		if (!storage.pageNumber) {
			storage.setItem('pageNumber', '1');
			storage.setItem('numTickets', response.numTickets);
			pageNumber = 1;
		}
		// tickets don't need to be loaded because they are already in storage
		else {
			pageNumber = storage.pageNumber;
		}

		// display the first available page of tickets and the first ticket in that page
		const tickets = await fetchPageofTickets(pageNumber);
		for (let i = 0; i < tickets.length; i++) {
			createTicketElement(tickets[i]);
		}
		const individualTicket =
			JSON.parse(storage.getItem('currentTicket')) || tickets[0];
		displayIndividualTicket(individualTicket);
	} catch (error) {
		alert(error.message);
		console.error(error);
	}
};

async function updatePage(change) {
	try {
		const currentPageNumber = +storage.getItem('pageNumber');
		const nextPageNumber = +storage.getItem('pageNumber') + change;
		// don't allow requests that go outside of the range of tickets
		if (
			nextPageNumber <= 0 ||
			(currentPageNumber * 25 >= storage.numTickets && change > 0)
		) {
			return;
		}

		// retrieve the next page of tickets and display it
		const tickets = await fetchPageofTickets(nextPageNumber);
		clearPreviousTickets();
		for (let i = 0; i < tickets.length; i++) {
			createTicketElement(tickets[i]);
		}
		// update the page number to session storage
		storage.setItem('pageNumber', nextPageNumber);
	} catch (err) {
		console.error(err);
		alert(error.message);
	}
}

function displayIndividualTicket(ticket) {
	const subjectElement = document.getElementById('ticket-subject');
	const idElement = document.getElementById('ticket-id');
	const descriptionElement = document.getElementById('ticket-description');
	const tagsElement = document.getElementById('ticket-tags');
	const timeElement = document.getElementById('ticket-time');

	subjectElement.textContent = ticket.subject;
	idElement.textContent = ticket.id;
	descriptionElement.textContent = ticket.description;
	tagsElement.textContent = `Tags: ${ticket.tags.join(', ')}`;
	timeElement.textContent = `Created at: ${ticket.time}`;
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
			return 'purple';
		case 'high':
			return 'yellow';
		case 'urgent':
			return 'red';
		default:
			return 'white';
	}
}

function clearPreviousTickets() {
	const ticketContainer = document.getElementById('ticket-container');
	while (ticketContainer.firstChild) {
		ticketContainer.removeChild(ticketContainer.firstChild);
	}
}

async function fetchAllTicketData() {
	let response = await fetch('/manyTickets', {
		method: 'POST',
	});
	response = await response.json();
	if (response.errorMsg) {
		throw new Error(response.errorMsg);
	}
	return response;
}

async function fetchPageofTickets(pageNumber) {
	let tickets = await fetch(`ticketPage/${pageNumber}`);
	tickets = await tickets.json();
	if (tickets.errorMsg) {
		throw new Error(tickets.errorMsg);
	}
	return tickets;
}

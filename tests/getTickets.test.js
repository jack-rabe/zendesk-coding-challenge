const { createTicket, getTickets } = require('../getTickets.js');
const testTickets = require('./testTickets.json');
// override default behavior of fetch
const fetch = require('node-fetch');
jest.mock('node-fetch');

describe('Ticket Creation', () => {
	test('Ticket one created successfully', () => {
		let ticketOne = testTickets[0];
		ticketOne = createTicket(ticketOne);
		expect(ticketOne.id).toEqual(1);
		expect(ticketOne.description).toEqual(
			'Aute ex sunt culpa ex ea esse sint cupidatat aliqua ex consequat sit reprehenderit. Velit labore proident quis culpa ad duis adipisicing laboris voluptate velit incididunt minim consequat nulla. Laboris adipisicing reprehenderit minim tempor officia ullamco occaecat ut laborum.\n' +
				'\n' +
				'Aliquip velit adipisicing exercitation irure aliqua qui. Commodo eu laborum cillum nostrud eu. Mollit duis qui non ea deserunt est est et officia ut excepteur Lorem pariatur deserunt.'
		);
		expect(ticketOne.subject).toEqual(
			'velit eiusmod reprehenderit officia cupidatat'
		);
		expect(ticketOne.priority).toEqual('normal');
		expect(ticketOne.tags).toEqual(['est', 'nisi', 'incididunt']);
		expect(ticketOne.time).toEqual('7/27/2021, 6:31:01 PM CDT');
		expect(ticketOne).not.toHaveProperty('requester_id');
		expect(ticketOne).not.toHaveProperty('assignnee_id');
	});
	test('Ticket two created successfully', () => {
		let ticketTwo = testTickets[1];
		ticketTwo = createTicket(ticketTwo);
		expect(ticketTwo.subject).toEqual('excepteur laborum ex occaecat Lorem');
		expect(ticketTwo.id).toEqual(2);
		expect(ticketTwo.description).toEqual(
			'Exercitation amet in laborum minim. Nulla et veniam laboris dolore fugiat aliqua et sit mollit. Dolor proident nulla mollit culpa in officia pariatur officia magna eu commodo duis.\n' +
				'\n' +
				'Aliqua reprehenderit aute qui voluptate dolor deserunt enim aute tempor ad dolor fugiat. Mollit aliquip elit aliqua eiusmod. Ex et anim non exercitation consequat elit dolore excepteur. Aliqua reprehenderit non culpa sit consequat cupidatat elit.'
		);
		expect(ticketTwo.priority).toEqual('normal');
		expect(ticketTwo.tags).toEqual(['labore', 'voluptate', 'amet']);
		expect(ticketTwo.time).toEqual('7/27/2021, 6:31:11 PM CDT');
		expect(ticketTwo).not.toHaveProperty('requester_id');
		expect(ticketTwo).not.toHaveProperty('assignee_id');
	});
	test('Times are parsed correctly on all tickets', () => {
		const tickets = testTickets.map((ticket) => createTicket(ticket));
		const timeValues = [
			'7/27/2021, 6:31:01 PM CDT',
			'7/27/2021, 6:31:11 PM CDT',
			'7/27/2021, 6:32:01 PM CDT',
			'8/27/2021, 6:31:01 PM CDT',
			'9/27/2021, 6:31:01 PM CDT',
		];
		for (let i; i < tickets.length; i++) {
			expect(tickets[i].time.toEqual(timeValues[i]));
		}
	});
});

describe('Ticket Retrieval', () => {
	test('Successfully retrieves a single page of 5 tickets', async () => {
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ tickets: testTickets, count: 5, next_page: null }),
			})
		);

		const ticketData = await getTickets();
		const tickets = ticketData.tickets;
		expect(ticketData.numTickets).toEqual(5);
		expect(tickets.length).toEqual(5);
		for (const ticket of tickets) {
			expect(ticket).toHaveProperty('priority');
			expect(ticket).toHaveProperty('subject');
			expect(ticket).toHaveProperty('id');
			expect(ticket).toHaveProperty('description');
			expect(ticket).toHaveProperty('recipient');
			expect(ticket).not.toHaveProperty('requester_id');
			expect(ticket).not.toHaveProperty('assignee_id');
		}
	});
	test('Test retrieval of multiple pages of tickets', async () => {
		fetch.mockReturnValueOnce(
			Promise.resolve({
				json: () =>
					Promise.resolve({
						tickets: testTickets,
						count: 10,
						next_page: 'Some URL',
					}),
			})
		);
		fetch.mockReturnValueOnce(
			Promise.resolve({
				json: () =>
					Promise.resolve({ tickets: testTickets, count: 10, next_page: null }),
			})
		);

		const ticketData = await getTickets();
		const tickets = ticketData.tickets;
		expect(ticketData.numTickets).toEqual(10);
		expect(tickets.length).toEqual(10);
		for (const ticket of tickets) {
			expect(ticket).toHaveProperty('priority');
			expect(ticket).toHaveProperty('subject');
			expect(ticket).toHaveProperty('id');
			expect(ticket).toHaveProperty('description');
			expect(ticket).toHaveProperty('recipient');
			expect(ticket).not.toHaveProperty('requester_id');
			expect(ticket).not.toHaveProperty('assignee_id');
		}
	});
});

const supertest = require('supertest');
const app = require('../server.js');
const testTickets = require('./testTickets.json');
// mock the calls to the Zendesk API
const { getTickets } = require('../getTickets.js');
jest.mock('../getTickets.js');

// the ticketPage route is not tested because it requires access to the user's session,
// which would be fairly complicated to test without using a smaller third-party module
describe('Test routes', () => {
	test('Get /', async () => {
		await supertest(app).get('/').expect('Content-type', /html/).expect(200);
	});
	test('POST /manyTickets', async () => {
		const testNumTickets = 5;
		getTickets.mockReturnValueOnce({
			tickets: testTickets,
			numTickets: testNumTickets,
		});
		const response = await supertest(app).post('/manyTickets').expect(201);
		expect(response.body.numTickets).toEqual(testNumTickets);
		const tickets = response.body.tickets;
		expect(tickets).toHaveLength(5);
		expect(tickets[0].subject).toEqual(
			'velit eiusmod reprehenderit officia cupidatat'
		);
		expect(tickets[4].priority).toEqual('urgent');
	});
	test('bad POST /manyTickets', async () => {
		getTickets.mockImplementationOnce(() => {
			throw new Error('Could not authenticate you.');
		});
		const response = await supertest(app).post('/manyTickets').expect(404);
		const message = JSON.parse(response.text).errorMsg;
		expect(message).toEqual(
			'The tickets could not be retrieved from the Zendesk servers. Please try again.'
		);
	});
});

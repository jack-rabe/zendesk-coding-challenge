const app = require('./server.js');
const port = 3000;
// start server in separate file to allow for supertest testing
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

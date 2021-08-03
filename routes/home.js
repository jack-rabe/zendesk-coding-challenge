const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).sendFile(path.resolve(__dirname, 'index.html'));
});

module.exports = router;

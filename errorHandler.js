const errorHandler = (err, req, res, next) => {
	res.status(err.statusCode);
	res.send(err);
};

module.exports = errorHandler;

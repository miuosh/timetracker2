var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Task = require('../models/task');

var query = require('./tasks.reports.query');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};


router.get('/:from-:to', isAuthenticated, function(req, res) {
	console.log('From: ' + req.params.from);
	console.log('To: ' + req.params.to);

		var getCompletedTasksBetweenDatePromise = query.getCompletedTasksBetweenDate(Number(req.params.from), Number(req.params.to), req.user.id);

		getCompletedTasksBetweenDatePromise.then( function(data) {
			res.status(200);
			res.send(data);
		})
		.catch( function(err) {
			console.log(new Date());
			console.log(err);
			res.status(500);
			res.send('Cannot retreive data');
		});

});

/* export module */
module.exports = router;

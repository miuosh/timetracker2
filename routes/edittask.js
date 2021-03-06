var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Task = require('../models/task');

var query = require('./tasks.query');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};



router.post('/setAsCompleted', isAuthenticated, function(req, res) {
			query.setAsCompleted(req.body)
	      .then(function(data) {
					console.log('setAsCompletePromise resolved');
					console.log(data);
	        res.status(200);
	        res.send(JSON.stringify(data));
	      })
	      .catch(function(err) {
					console.log('setAsCompletePromise rejected' + err);
	        res.status(400);
	        res.send(JSON.stringify(err));
	      })



    }); // #setAsCompleted

	/*
		PUT - edit task
	*/

	router.put('/edit/', isAuthenticated, function(req, res) {
		var task = req.body;
		var user = req.user;
		if (task._creator === user.id || !task.isPerforming) {
			var editTaskPromise = query.editTask(task);

			editTaskPromise.then(function(data) {
				res.status(200);
				res.send(data);
			})
			.catch(function(err) {
				res.status(400);
				res.send(JSON.stringify(err));
			});

		} else {
				console.log('edit task...Cannot modify task.');
			res.status(400);
			res.send(JSON.stringify({
				message: "Cannot modify task. Possible cause: task is runnig or you not owner of this task."
			}))
		}

	});



module.exports = router;

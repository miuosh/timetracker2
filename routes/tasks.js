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

/** GET all tasks */
router.get('/', isAuthenticated, function(req, res) {

	var getTasksPromise = query.getUserTasks(req.user.id );
	getTasksPromise.then(function(data){
		res.send(data);
	})
	.catch(function(err) {
		res.send(JSON.stringify(err));
	})
}); //#get '/'

/** GET Task of given :id */
router.get('/:id', function(req, res) {
        var getTaskPromise = query.getUserTask(req.user.id, req.params.id);
				getTaskPromise.then(function(data) {
					res.send(JSON.stringify(data));
				})
				.catch(function(err) {
					console.log(err);
					res.send(JSON.stringify({err: { message: 'Cannot get task of given id.'}}))
				})
    });


router.post('/toggle/:id', isAuthenticated, function(req, res) {

		var stop = query.toggleUserTask(req.user.id, req.params.id);
		stop.then(function(data) {
				console.log('tooggle resolved: ');
				console.log(data);
				res.status(200);
				res.send(JSON.stringify(data));
		})
		.catch(function(err) {
			console.log(err);
			res.status(500);
			res.send(err);
		})


});

 /**
  *  GET - dayView
  */

  router.get('/dayView/:date', function(req, res) {

		var promise = query.getUserTasksByDate(req.user.id, Number(req.params.date));

		promise.then(function(data) {
			res.status(200);
			res.send(JSON.stringify(data))
		})
		.catch(function(err) {
			console.log(err);
			res.status(500);
			res.send(err);
		});

  });

/*
	POST - add new task
*/
    router.post('/', isAuthenticated, function(req, res) {
			var body = req.body;
			var userId = req.user.id
			console.log(userId);
			console.log(body);
			if(typeof body.desc != 'string'||	typeof body.category!='string' || typeof body.project!='string') {
				res.status(400);
				res.send({message: 'Fill all required data in form!'});
			} else {
					var addTaskPromise = query.addTask(body, userId);
					addTaskPromise.then(function(data) {
						res.status(200);
						res.send(data);
					})
					.catch(function(err) {
						console.log(err);
						res.status(400);
						res.send(JSON.stringify({ message: 'Error: Cannot add new task.'}));
					})
			}
  });

	// dayView POST
	router.post('/dayViewEdit/', isAuthenticated, function(req, res) {
		console.log(req.body);

		res.status(200);
		res.send('OK');
	})



    // /** DELETE Task of given ID */
    router.delete('/:id', isAuthenticated, function(req, res) {
        var id = req.params.id;
        Task.remove({ _id: id }, function(err) {
            if (!err) {
                console.log('Task _id:' + id + ' removed');
                res.send( { 'message': "Task removed succesfully"});
            } else {
                console.error('Cannot remove task: ' + id);
                res.send( { 'message': "Cannot remove task"});
            }
        });
    });

    router.post('/remove', isAuthenticated, function(req, res) {
        var IDs = req.body;
				console.log('Delete ids: ');
				console.log(IDs);
        Task.remove({ '_id': { $in: IDs } }, function(err){
            if (err) {
                console.error(err);
                res.send({message: 'Cannot delete selected tasks' + err} );
            } else {
                console.log('User: ' + req.session.passport.user + ' - removed: ' + IDs);
								res.status(200);
                res.send({ message: 'Task removed.' });
            }
        });

    });

		router.post('/edit/history/', function (req, res) {

			var userId = req.user.id;
			var newItem = req.body;
			var editHistoryItemPromise = query.editTaskHistoryItem(userId, newItem);
			editHistoryItemPromise.then(function(data) {
				res.status(200);
				res.send('Zapisano wprowadzone zmiany!');
			})
			.catch(function(err) {
				res.status(500);
				res.send(err);
			})

		});

		router.delete('/edit/history/:id',isAuthenticated, function(req, res) {
			var userId = req.user.id;
			var historyItemId = req.params.id;

			var removePromise = query.removeTaskHistoryItem(userId, historyItemId);

			removePromise.then(function(data) {
				res.status(200);
				res.send('Usunięto próbkę: ' + historyItemId);
			})
			.catch(function(err){
				res.status(500);
				res.send(err.message);
			})

		})


module.exports = router;

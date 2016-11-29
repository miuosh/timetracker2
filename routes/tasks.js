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

		// var toggleTaskPromise = query.toggleUserTask(req.user.id, req.params.id);
		// console.log(toggleTaskPromise);
		// toggleTaskPromise.then(function(data) {
		// 	res.send(JSON.stringify(data));
		// })
		// .catch(function(err) {
		// 	res.send(JSON.stringify({err: {message: 'Cannot toggle task of given id.'}}))
		// })
		// stopAllUserTasks działa
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
  *  GET Report
  */

  router.get('/report/:year-:month', function(req, res) {

      var userID = req.session.passport.user;
      // moth - from 0 - 11
      // date - day on the month - 1-31
      var year = parseInt(req.params.year);
      var month = parseInt(req.params.month);
      var fromDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      var lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 0);
      //fromDate = fromDate.toISOString();
     // lastDayOfMonth = lastDayOfMonth.toISOString();
      console.log('fd: ' +  fromDate);
     // console.log('ld: ' +  lastDayOfMonth.toISOString());
      console.log(userID);

      Task.find( { "_creator": userID ,"updated":  { "$gte": fromDate, "$lte": lastDayOfMonth } }, function(err, data) {
          if (err) {
              console.log(err);
              res.send('error - cannot get report');
          } else {
              console.log(data);
            res.send(data);
          }
      })

  });

    router.post('/', isAuthenticated,function(req, res) {
			console.log('Request to add new task');
			if(!req.body.desc || !req.body.category || typeof req.body.desc != "string" || typeof req.body.category != "string") {
				res.status(400);
				console.log('Error: cannot parse req.body')
				res.send({message: 'Error: cannot parse received data!'});
			} else {
										var task = new Task({
														desc: req.body.desc,
														category: req.body.category,
														creationDate: new Date(),
														updated: new Date(),
														isPerforming: false,
														_creator: user[0]._id
										});
										task.save( function(err) {
												if (err) { throw err; }
												else {
														res.status(200);
														res.send(JSON.stringify(task));
														console.log('Task saved.'); }
										});

			} // #else
    });


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


    /**
     *  categories
     */

    router.get('/categories/', function(req, res) {
        var cat = [ "Instalacja",
            "Konfiguracja",
            "Testy"];


				res.status(200);
        res.send(cat);
    });

		router.post('/categories/',isAuthenticated, function(req, res) {
			res.send({message: 'OK'})
		});

		router.post('/categories/remove', isAuthenticated, function(req, res) {
			res.send({message: 'Removed'});
		})

		/*
			projects
		*/

		router.get('/projects/',isAuthenticated, function(req, res) {
			res.send({message: 'Projects OK'});
		});

		router.post('/projects/', isAuthenticated, function(req, res) {
			res.send({message: 'project added'})
		});





module.exports = router;

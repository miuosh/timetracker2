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

    router.post('/', function(req, res) {
        var user = Account.find( { 'username': req.user.username }, function(err, user) {
            // In case of any error, return using the done method
                    if (err)
                        console.error(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+ username);
                        req.flash("error", 'User Not Found with username');
                    }
                    //console.log(user[0]._id);
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
                            res.send(JSON.stringify(task));
                            console.log('Task saved.'); }
                    });

        });
        //res.send( { 'message': "Task saved succesfully"});
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
     *  GET categories
     */

    router.get('/categories/', function(req, res) {
        var cat = [ "Instalacja",
            "Konfiguracja",
            "Testy"];


				res.status(200);
        res.send(cat);
    });


module.exports = router;

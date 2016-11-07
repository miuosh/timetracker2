var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Task = require('../models/task');


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
    router.get('/', function(req, res) {

        var task = User.find( {'username': req.user.username}, function (err, user) {
            //console.log('user ID: ' + user[0]._id);
            Task.find({'_creator': user[0]._id }, function(err, tasks) {
                if (err) console.error(err);
                res.send(JSON.stringify(tasks));
            });

        });
    });

    /** GET Task of given :id */
    router.get('/:id', function(req, res) {
            Task.find({'_id': req.params.id }, function(err, task) {
                if (err) {
                    console.error(err);
                    req.flash("error", 'Cannot find task of given ID');
                }
                res.send(JSON.stringify(task));
            });

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

    /** POST - Update task of given :id */
    /**
     *  TODO - res.send (values after complete all promises)
     */
    router.post('/toogle/:id', isAuthenticated, function(req, res) {
        var id = req.params.id;
        var userID = req.session.passport.user;
        console.log('User: ' + req.session.passport.user);
        //stopTasksInProgress(userID);
        //updateTask(id);

        // find all document that is running and update .isPerforming field to false, count duration
        // set current task .isPerforming field to true, count duration
        /**
         * findall and update
         * then update current
         */

        /*
        // Kod działający bez zwracania wartości
        var data = [];
       var promise = getRunningTaskPromise(null,userID);
       promise.then(function (tasks) {
           tasks.forEach(function (task) {
               console.log('modyfikacja uruchomionego zadania: ' + task._id);
               //???
               // modify the isPerforming fields
               task.task.isPerforming = task.task.isPerforming ? false : true;
               var currentTime = new Date();
               if (!task.task.isPerforming) {
                   var currentDuration = (currentTime - task.task.updated) / 1000; // ms -> sec
                   var lastDuration = task.task.duration;
                   task.task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
               }

               task.task.updated = currentTime;
               task.save(function (err) {
                   if (err) {
                       console.error(err);
                       //res.send('Cannot toogle task');
                   } else {
                       console.log('Modyfikacja: Task _ID:' + task._id + ' updated succesfully!');
                       // res.send(JSON.stringify(task));
                       //data.push(task);
                   }
               });
           });

       })
       .then(function() {
           console.log('update....' + id);
           console.log('tasks...');
           console.log(tasks);
           updateTask(id);
        })
       .then(function(){
           console.log('res.send');
           Task.find({'_creator': id},function (err, data) {
               res.send(JSON.stringify(data));
           });
       });
            */

        var promise = getStopTasksInProgressPromise(null, userID);


        var updatePromise = updateTaskPromise(id);

        Promise.all([promise, updatePromise]).then(function(tasks) {
            // first element is empty if no running tasks
            console.log('Task[0].length: ' + tasks[0].length);
            /**
             * if first promise return [] => no tasks to stop
             * send only second promise return value
             */
            console.log(tasks[0]);
            console.log(tasks[1]);
            res.send( JSON.stringify(tasks) );

            console.log(tasks);
             console.log('Zakończono modyfikacje');

        });

    }); //post

    // 2 opcja
    // utworzenie tablicy promises ktore wykonują save
    // użycie Promise.all(tablica). then( updateCurrent() )
    // res.send (???)

    function updateTaskPromise(id) {
        var promise =  Task.find({'_id': id }, function(err, data) {
            if (err) console.error(err);
            var task = data[0];
            task.isPerforming = task.isPerforming ? false : true;
            var currentTime = new Date();
            if (!task.isPerforming) {
                var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
                var lastDuration = task.duration;
                task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
            }

            task.updated = currentTime;
            task.save(function(err) {
                if (err) {
                    console.error(err);
                    //res.send('Cannot toogle task');
                } else {
                    console.log('Task _ID:' + id + ' updated succesfully!');
                   // res.send(JSON.stringify(task));
                }
            });
        }).exec(); // find _id
        return promise;

    }
    function updateTask(id) {
           Task.find({'_id': id }, function(err, data) {
            if (err) console.error(err);
            var task = data[0];
            task.isPerforming = task.isPerforming ? false : true;
            var currentTime = new Date();
            if (!task.isPerforming) {
                var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
                var lastDuration = task.duration;
                task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
            }

            task.updated = currentTime;
            task.save(function(err) {
                if (err) {
                    console.error(err);
                    //res.send('Cannot toogle task');
                } else {
                    console.log('Task _ID:' + id + ' updated succesfully!');
                   // res.send(JSON.stringify(task));
                }
            });
        }); // find _id

    }

    function stopTasksInProgress(user) {
        // find all tasks in progress

        Task.find({ 'isPerforming': true, 'task._creator': user}, function(err, data) {
            console.log(data);
            if (err) {
                console.log(err);
            } else {
                data.forEach(function (element) {
                    updateTask(element._id);
                }, this);
            }

        });

    }

    function getStopTasksInProgressPromiseTest(id, user) {

        var findPromise = Task.find({'isPerforming': true, 'task._creator': user}).exec();
        var savePromises = [];
        promiseFind.then(function(data) {
            console.log(data);
              data.forEach(function (task) {
                    task.isPerforming = task.isPerforming ? false : true;
                    var currentTime = new Date();
                    if (!task.isPerforming) {
                        var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
                        var lastDuration = task.duration;
                        task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
                    }
                    task.updated = currentTime;
                    savePromises.push( task.save().exec() );
                }, this);

        });

        var promises = savePromises.unshift(findPromise);
        console.log(promises);
        return promises;
    }


    function getStopTasksInProgressPromise(id, user) {
        var promise = Task.find({'isPerforming': true, '_creator': user}, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                data.forEach(function (task) {
                    task.isPerforming = task.isPerforming ? false : true;
                    var currentTime = new Date();
                    if (!task.isPerforming) {
                        var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
                        var lastDuration = task.duration;
                        task.task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
                    }
                    task.updated = currentTime;
                    task.save(function(err){
                        if (err) {
                            console.log('save error.. ' + err);
                        } else {
                            console.log('Task saved: ' + id);
                        }

                    });
                }, this);
            }
        }).exec();
        return promise;
    }

    function getRunningTaskPromise(id, user) {
         //var promise = Task.find({ 'task.isPerforming': true, 'task._creator': user}).exec();

        var promise = Task.find({ 'isPerforming': true, '_creator': user }, function (err, data) {
            //console.log(data);
            if (err) {
                console.log(err);
            } else {

            }

        });
         return promise;
    }

    router.post('/', function(req, res) {

        var user = User.find( { 'username': req.user.username }, function(err, user) {
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


    /** DELETE Task of given ID */
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

    router.delete('/', isAuthenticated, function(req, res) {
        var IDs = req.body;
        Task.remove({ '_id': { $in: IDs } }, function(err){
            if (err) {
                console.error(err);
                res.send({message: 'Cannot delete selected tasks' + err} );
            } else {
                console.log(req.session.passport.user + 'removed' + IDs);
                res.send({ message: 'Usunięto' });
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



        res.send(cat);
    });
module.exports = router;

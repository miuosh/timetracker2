var Q = require('q');
var Task = require('../models/task');

module.exports = {

  //all functions returns promises
  getTasks: function(){

  },

  getUserTasks: function(userid) {
    var query = Task.find({'_creator': userid}).exec();
    return query;
  },

  stopUserTasks: function(userid) {
/*
    var deferred = Q.defer();
    var query = Task.find({'_creator': userid}).exec();


    query.then(function(data, err) {
      if (err) {
        deferred.reject(err);
      }
      var len = data.length;
      var saveTasksPromises = [];
      for(var i = len; i--; ) {
        console.log(data[i]._id);
        var task = data[i];
        task.isPerforming = false;
        saveTasksPromises.push(task.save());
      }
      return saveTasksPromises;
      })
      .then(function(data, err) {
        var all = Q.all(data);
        all.then(function(data, err) {
          if(err) {
            deferred.reject(err);
          }
          deferred.resolve(data);
        })

      });
      return deferred.promise;
*/

var deferred = Q.defer();
  var promise = Task.find({'_creator': userid, 'isPerforming': false }).exec();

  promise.then(function(data) {
      var len = data.length;
      var saveTasksPromises = [];

      for(var i = len; i--; ) {
        var task = data[i];
        task.isPerforming = false;
        saveTasksPromises.push(task.save());
        //saveTasksPromises.push(Task.save({'_id': data[i]._id, 'isPerforming': false}));
      }
      return Q.all(saveTasksPromises);
    })
    .then(function(data) {
      deferred.resolve(data);
    })
    .catch(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }// #stopUserTasks

}// #module.exports

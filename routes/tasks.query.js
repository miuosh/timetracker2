var Task = require('../models/task');

module.exports = {

  getAllTasks: function() {
    var promise = Task.find({}).exec();
    return promise;
  },

  getUserTasks: function(userId) {
    var promise = Task.find({'_creator': userId}).exec();
    return promise;
  },

  stopAllUserTasks: function(userId) {
  var promise = Task.find({'_creator': userId, 'isPerforming': true }).exec();

    return promise.then(function(data) {
          var len = data.length;
          var saveTasksPromises = [];
          for(var i = len; i--; ) {
            var task = data[i];
            task.isPerforming = false;
            task.updated = new Date();
            saveTasksPromises.push(task.save());
          }
          return Promise.all(saveTasksPromises); // all .save execute in parallel
      });
  },// #stopUserTasks


  startUserTask: function(userId, taskId) {
  var promise = Task.find({'_id': taskId ,'_creator': userId, 'isPerforming': false }).exec()

    return promise.then(function(data){
      var task = data[0];
      task.isPerforming = true;
      task.updated = new Date();

      return task.save();
    });
  }// #startUserTask

}// #module.exports

var Task = require('../models/task');

module.exports = {
  getAllTasks: getAllTasks,
  getUserTasks: getUserTasks,
  getTask: getTask,
  getUserTask: getUserTask,
  startUserTask: startUserTask,
  stopUserTask: stopUserTask,
  stopAllPerfomingUserTasks: stopAllPerfomingUserTasks,
  toggleUserTask: toggleUserTask,
  setAsCompleted: setAsCompleted,
  editTask: editTask

}

  function getAllTasks() {
    var promise = Task.find({}).exec();
    return promise;
  }

  function getUserTasks(userId) {
    var promise = Task.find({'_creator': userId}).exec();
    return promise;
  }

  function getTask(taskId) {
    var promise = Task.find({'_id': taskId}).exec();
    return promise;
  }

/*
  @param {string, string} - userId, taskId
*/
  function getUserTask(userId, taskId) {
    var promise = Task.find({'_id': taskId, '_creator': userId}).exec();
    return promise;
  }

  function startUserTask(userId, taskId) {
  var promise = Task.find({'_id': taskId ,'_creator': userId, 'isPerforming': false }).exec()

    return promise.then(function(data){
      var task = data[0];
      task.isPerforming = true;
      var currentTime = new Date();
      if (!task.isPerforming) {
          var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
          var lastDuration = task.duration;
          task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
      }
      task.updated = currentTime;

      return task.save();
    });
  }// #startUserTask

  function stopUserTask(userId, taskId) {
    var promise = Task.find({'_id': taskId,'_creator': userId, 'isPerforming': true}).exec();

    return promise.then(function(data) {
      /* what if empty field i.e. data CastError */
      var task = data[0];
      task.isPerforming = false;
      task.updated = new Date();

      return task.save();
    });
  }

  /*
    Stop all running tasks. Task.isPerforming : true -> false;
    Task.updated is modified.
    Task.duration is calculated.
    @param {string}: userId
    @return task.save() promise
  */

   function stopAllPerfomingUserTasks(userId) {
    console.log(userId);
    var promise = Task.find({'_creator': userId, 'isPerforming': true }).exec();

    return promise.then(function(data) {
          var len = data.length;
          var saveTasksPromises = [];
          // loop tasks
          for(var i = len; i--; ) {
            var task = data[i];
            task.isPerforming = false;
            var currentTime = new Date();

            if (!task.isPerforming) {
                var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
                var lastDuration = task.duration;
                task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
            }

            task.updated = currentTime;
            saveTasksPromises.push(task.save());
          }
          return Promise.all(saveTasksPromises); // all .save execute in parallel
      })
      .catch(function(err) {
        return err;
      });
  }// #stopUserTasks

  /*
    @return {promise} - startedTask promise
  */
  function toggleUserTask(userId, taskId) {
    /*
    1. stop all performing tasks except one (taskId)
    2. get task of given Id
    2. toggle task of given taskId
    */
    var stopUserTasksPromise = Task.find( {'_creator': userId, 'isPerforming': true, '_id': { '$ne': taskId } } ).exec();

    return stopUserTasksPromise.then(function(data) {
      var len = data.length;
      var saveTaskPromises = [];
      // loop tasks
      for(var i = len; i--; ) {
        var task = data[i];
        task.isPerforming = false;
        var currentTime = new Date();

        if (!task.isPerforming) {
            var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
            var lastDuration = task.duration;
            task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
        }

        task.updated = currentTime;
        saveTaskPromises.push(task.save());
      }

      return Promise.all(saveTaskPromises);
    })
    .then(function(data) {
      return getUserTask(userId, taskId);
    })
    .then(function(data) {

      console.log('data: ');
      console.log(data);
      var task = data[0];

        task.isPerforming = task.isPerforming ? false : true;
        var currentTime = new Date();
        if (!task.isPerforming) {
            var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
            var lastDuration = task.duration;
            task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
        }

        task.updated = currentTime;
      return task.save();
    });
  }

  /*
  @param {Array} - taskIds - array of ids
  */
    function setAsCompleted(taskIds) {

      var promise = Task.find({ '_id': { '$in': taskIds }}).exec();

    return  promise.then(function(data) {
            var len = data.length;
            var editTaskPromise = [];
            console.log(data);
            for (var i = len; i--; ) {
              var task = data[i];
              task.isCompleted = true;
              editTaskPromise.push(task.save());
            }

            return Promise.all(editTaskPromise);
          })
          .catch(function(err) {
            return err;
          });
    };

function editTask(task) {
  var promise = Task.find({'_id': task.id }).exec();

  promise.then(function(data) {
    var prevTask = data[0];
    prevTask = task;

    return task.save();
  })
  .catch(function(err) {
    return err;
  });
}

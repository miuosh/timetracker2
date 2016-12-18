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
  editTask: editTask,
  addTask: addTask

}

/*
  INTERNAL MODULE FUNCTIONS
*/

  var getDuration = getDuration;



//------------------------------------------------------------------------------
/*
          EXPORT MODULE FUNCTIONS
*/
//------------------------------------------------------------------------------

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

    getDuration();

    /*
    1. stop all performing tasks except one (taskId)
      - find all started Tasks (isPerforming), except task of taskId
      - for each task
              - set isPerforming to false (stop task)
              - getcurrentDuration and save to Task.sample - { startTime: lastUpdated, stopTime: currentTime, dt: currentDuration }
              - Task.duration -> duration += currentDuration

    2. toggleTask of given Id
        - getUserTask
        - isPerforming ? false: true
        - getcurrentDuration and save data to Task.sample
        - Task.duration -> duration += currentDuration
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

        var lastUpdated = task.updated;
        var lastDuration = task.duration;

        var currentDuration = (currentTime - lastUpdated) / 1000; // ms -> sec

        /*
          if task was running then task.updated property contains timestamp of "start action"
        */
        var timespan = {
          startTime: lastUpdated,
          stopTime: currentTime,
          dt: currentDuration
        };

        task.history.push(sample);
        // if user dont't edit task - simply duration = last + current
        task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
        task.updated = currentTime; // keep STOP timestamp

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
        // if toggle task cause STOP then calculate duration and save sample
        if (!task.isPerforming) {
            var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
            var lastDuration = task.duration;
            task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
        } else {

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
  var promise = Task.find({'_id': task._id }).exec();

  return promise.then(function(data) {
        console.log(data);
          var prevTask = data[0];
          prevTask.desc = task.desc;
          prevTask.project = task.project;
          prevTask.category = task.category;
          prevTask.duration = task.duration;
          prevTask.isCompleted = task.isCompleted;

          return prevTask.save();
        })
        .catch(function(err) {
          return err;
        });
}

function addTask(item, creatorID) {
    var task = new Task({
          desc: item.desc,
          category: item.category,
          project: item.project,
          creationDate: new Date(),
          updated: new Date(),
          isPerforming: false,
          _creator: creatorID
    });

    return task.save();
}

//------------------------------------------------------------------------------
/*
    INTERNAL FUNCTIONS
*/
//------------------------------------------------------------------------------

function getDuration(task) {

  if (!task.isPerforming) {
      var currentDuration = (currentTime - task.updated) / 1000; // ms -> sec
      var lastDuration = task.duration;
      task.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
  }
}

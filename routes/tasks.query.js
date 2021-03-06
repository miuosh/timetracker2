var Task = require('../models/task');

module.exports = {
  getAllTasks              : getAllTasks,
  getUserTasks             : getUserTasks,
  getTask                  : getTask,
  getUserTask              : getUserTask,
  getUserTasksByDate       : getUserTasksByDate, // used in dayView

  startUserTask            : startUserTask,
  stopUserTask             : stopUserTask,
  stopAllPerfomingUserTasks: stopAllPerfomingUserTasks,

  toggleUserTask           : toggleUserTask,
  setAsCompleted           : setAsCompleted,

  editTask                 : editTask,
  editTaskHistoryItem      : editTaskHistoryItem,
  removeTaskHistoryItem    : removeTaskHistoryItem,

  addTask                  : addTask,

  /* dayView */
  editDayView              : editDayView
}

/*
  INTERNAL FUNCTIONS
*/

  var sumByProperty     = sumByProperty;
  var modifyStoppedTask = modifyStoppedTask; // calculate duration and add timespan to history
  var calcDuration = calcDuration;


//------------------------------------------------------------------------------
/*
          EXPORT MODULE FUNCTIONS
*/
//------------------------------------------------------------------------------

  function getAllTasks() {
    var promise = Task.find({}).exec();
    return promise;
  }

  function getUserTasks(userId, queryParam) {

    var queryObj = {
      '_creator': userId
    }

    var excludeFields = {
      history: 0
    }

    if(queryParam.completed === 'false') {
      queryObj['isCompleted'] = false;
    } else if(queryParam.completed === 'true') {
      queryObj['isCompleted'] = true;
    }

    return Task.find(queryObj, excludeFields).exec();
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
    var stopUserTasksPromise = Task.find( {'_creator'    : userId, 'isPerforming': true, '_id': { '$ne': taskId } } ).exec();

    return stopUserTasksPromise.then(function(data) {
      var len = data.length;
      var saveTaskPromises = [];

      // loop tasks
      for(var i = len; i--; ) {
        var task          = data[i];
        task.isPerforming = false;
        task              = modifyStoppedTask(task);
        saveTaskPromises.unshift(task.save());
      }

      return Promise.all(saveTaskPromises);
    })
    .then(function(data) {
      return getUserTask(userId, taskId);
    })
    .then(function(data) {

      var task = data[0];
        task.isPerforming = task.isPerforming ? false : true;
        var currentTime = new Date();
        if (!task.isPerforming) {
          task = modifyStoppedTask(task);
        } else {
          task.updated = currentTime;
        }

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
  var promise = Task.find({'_id': task._id, 'isPerforming': false  }).exec();

  return promise.then(function(data) {
        console.log(data);
          var prevTask = data[0];

          prevTask.desc        = task.desc;
          prevTask.project     = task.project;
          prevTask.category    = task.category;
          prevTask.isCompleted = task.isCompleted;


          prevTask.history = task.history;
          prevTask.duration = sumByProperty(task.history, 'dt')

          return prevTask.save();
        })
        .catch(function(err) {
          return err;
        });
}

function addTask(item, creatorID) {
    var task = new Task({
          desc        : item.desc,
          category    : item.category,
          project     : item.project,
          creationDate: new Date(),
          updated     : new Date(),
          isPerforming: false,
          _creator    : creatorID
    });

    return task.save();
}

function getUserTasksByDate(userID, date) {
  var _date = new Date(date);
  _date.setHours(0);
  _date.setMinutes(0);
  _date.setSeconds(0);
  _date.setMilliseconds(0);

  var endDay = new Date(date);
  endDay.setHours(23);
  endDay.setMinutes(59);
  endDay.setSeconds(59);
  endDay.setMilliseconds(999);

  var fromDate = _date.toISOString();
  var toDate = endDay.toISOString();
  //console.log('fromDate: ' + fromDate);
 //console.log('toDate: ' + toDate);

  var promise = Task.find({
    '_creator' : userID,
    'history' : {
      '$elemMatch' : {
        'startTime' : {
          '$gte' : fromDate,
          '$lt' : toDate
        }
      }
    }
  }).exec();

  return promise;
}

/* dayView */

function editDayView(items) {
  console.log(items);
}

function removeTaskHistoryItem(userID, historyItemId) {
  var promise = Task.find({
    '_creator' : userID,
    'history' : {
      '$elemMatch' : {
        '_id' : historyItemId
      }
    }
  }).exec();

  return promise.then(function(data) {
        var prevItem      = data[0];
        var index         = prevItem.history.findIndex(item => item.id === historyItemId);
        prevItem.history.splice(index, 1);
        prevItem.duration = Math.round(sumByProperty(prevItem.history, 'dt'), 0);
        prevItem.updated  = new Date();
        return prevItem.save();
      })
      .catch(function(err) {
        return err;
      })
}//#

function editTaskHistoryItem(userId, newItem) {
  var promise = Task.find({
    '_creator' : userId,
    'history' : {
      '$elemMatch' : {
        '_id' : newItem._id
      }
    }
  }).exec();

  return promise.then(function(data) {
      var prevItem            = data[0];
      var index               = prevItem.history.findIndex(item => item.id === newItem._id);
      prevItem.history[index] = newItem; //assume that client calculate dt
      prevItem.duration       = Math.round(sumByProperty(prevItem.history, 'dt'), 0); // round to full sek

      return prevItem.save();
    })
    .catch(function(err) {
      return err;
    })
}

//------------------------------------------------------------------------------
/*
    INTERNAL FUNCTIONS
*/
//------------------------------------------------------------------------------

function sumByProperty(items, property) {

  if (items == 0) return 0;

  return items.reduce((previous, current) => {
    return current[property] == null ? previous : previous + parseFloat(current[property]);
  }, 0)
}

function modifyStoppedTask(task) {
    var currentTimeStamp     = new Date();
    var lastUpdatedTimeStamp = task.updated;
    var lastDuration         = task.duration;

    var currentDuration = (currentTimeStamp - lastUpdatedTimeStamp) / 1000; // ms -> sec

    var timespan = {
      startTime: lastUpdatedTimeStamp,
      stopTime : currentTimeStamp,
      dt       : currentDuration
    };

    task.history.unshift(timespan);
    task.updated = currentTimeStamp;
    task.duration = Math.round(sumByProperty(task.history, 'dt'), 0); // round to full sek

  return task;
}

function calcDuration(starTime, stopTime) {
  if (typeof starTime === 'string' && typeof stopTime === 'string') {
    var start = new Date(starTime);
    var stop = new Date(stopTime);
    return Math.round((stop.getTime() - start.getTime()) / 1000, 1);

  } else if (typeof starTime === 'string' && !isNaN(starTime) && !isNaN(stopTime) ) {
    var start = new Date(Number(starTime));
    var stop = new Date(Number(stopTime));

      return Math.round((stop.getTime() - start.getTime()) / 1000, 1);
  } else {
    return -1;
  }
}

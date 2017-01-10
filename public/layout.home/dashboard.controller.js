(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */
  DashboardController.$inject = ['$scope', '$interval', '$timeout', '$mdDialog', 'dataservice'];

  function DashboardController($scope, $interval, $timeout, $mdDialog, dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = [];
    vm.intervalsID = [];

    vm.getTasks = getTasks;
    vm.editTask = editTask;
    vm.removeTasks = removeTasks;
    vm.toggleTask = toggleTask;
    vm.setAsCompleted = setAsCompleted;
    vm.startTimer = startTimer;
    vm.stopTimer = stopTimer;

    vm.countDuration = countDuration;

    // filter table
    $scope.sortType = 'updated';
    $scope.sortReverse = true;
    $scope.searchType = '';


    console.log('Init Dashboard Controller');
    loadTasks();
    initEvents();
    /////////////////////

    function loadTasks() {
      return getTasks().then(function(data) {
        console.log('Loading tasks...');
        return data;
      });

    }// #loadTasks

////////////////////////////////////////////////////////
    function getTasks(){
      return dataservice.getTasks()
          .then(function(data) {
            vm.tasks = data;
            return vm.tasks;
          })
          .then(function(data) {
              vm.stopTimer();
              //console.log('Init timers');
              if (angular.isArray(data)) {
                  var len = data.length;
                  for (var i = len; i--; ) {
                    if(data[i].isPerforming) {
                      vm.countDuration(data[i]);
                      vm.startTimer(data[i]);
                    }
                }
              }

            return data;
          })
          .catch(function(err) {
            console.log(err);
            return err;
          });
  }// #getTasks

    function removeTasks(ev) {

      /* Confirm remove tasks */

         // Appending dialog to document.body to cover sidenav in docs app
         var confirm = $mdDialog.confirm()
               .title('Czy na pewno usunąć zaznaczone zadania?')
               .textContent('')
               .ariaLabel('Usuń zadania')
               .targetEvent(ev)
               .ok('Tak, usuń')
               .cancel('Anuluj');

         $mdDialog.show(confirm).then(function() {
            var ids = getSelectedTasks();
           return dataservice.removeTasks(ids)
                     .then(getTasks);
         }, function() {
           console.log('Anulowano usuwanie');
         });
    }// #removeTasks

    function getSelectedTasks() {
      var ids = [];
      var len = vm.tasks.length;
      for (var i = len; i--; ) {
        if (vm.tasks[i].selected){
          ids.push( vm.tasks[i]._id);
        }
      }
      return ids;
    }


    function toggleTask(item) {
      return dataservice.toggleTask(item._id)
                .then(function(data) {
                  return data;
                }).then(function(data) {
                  return getTasks();
                });

    }// #toogleTask

    function startTimer(item) {
      //console.log(item);
      var intervalPromise = $interval(function() {
        item.duration++;
      }, 1000);

      var taskID = item._id;
      vm.intervalsID.push({
        intervalPromise: intervalPromise,
        taskID: taskID });
      return intervalPromise;
    } // #startTimer

    function stopTimer() {
      console.log('Stop timers');
      var len = vm.intervalsID.length;
        for (var i = len; i-- ;  ) {
                $interval.cancel(vm.intervalsID[i].promiseID);
                vm.intervalsID.splice(i, 1);
        }
    }// #stopTimer

    function initEvents() {
      $scope.$on('$destroy', function() {
        vm.stopTimer();
        console.log('DashboardController scope destroyed.');
      });

      $scope.$on('addNewTask', function (event, data) {
        console.log('Event: newTask');
        console.log(data);
        vm.tasks.unshift(data);
      });
    }

    function countDuration(item) {
      var currentTime = new Date();
      //console.log('currentTime: ' + currentTime);
      //console.log('item.updated: ' + item.updated);
      var updated = new Date(item.updated);
      //console.log('new item.updated: ' + item.updated);
      var currentDuration = (currentTime - updated) / 1000; // ms -> sec
      //console.log('currentDuration: ' + currentDuration);
      var lastDuration = item.duration;
      item.duration = Math.round(currentDuration + lastDuration, 0); // round to full sek
      return item;
    }

    function setAsCompleted() {
      var ids = getSelectedTasks();
      return dataservice.setAsCompleted(ids)
                .then(getTasks);

    }

    function editTask(ev, item) {
      $mdDialog.show({
        locals: {
          task: item
        },
        controller: EditTaskDialogController,
        controllerAs: 'edc',
        templateUrl: '/layout.home/edit.task.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: true
      })
      .then(function(answer) {
        console.log('Dialog OK: ' + answer);
      }, function(){
        console.log('Cancel dialog.');
      });
    }// #editTask


    //-------------------------------------------------
    //  EditTaskDialogController - edit Task
    //-------------------------------------------------

    function EditTaskDialogController ($scope, $interval, $timeout, $mdDialog, dataservice, task) {
      var self = this;
      self.hide            = hide;
      self.cancel          = cancel;
      self.answer          = answer;
      self.removeTimeSpan  = removeTimeSpan;
      // change time / date
      self.addHour         = addHour;
      self.substractHour   = substractHour;
      self.addMinute       = addMinute;
      self.substractMinute = substractMinute;


      //form
      self.task = task || {};
      self.save = save;

      //data validation
      self.task.history.isValid = {};


      //intervals
      var interval = null;
      self.initInterval = initInterval;
      self.cancelInterval = cancelInterval;
      var ms = 125; //interval and cancel interval timeout

      //Internal functions
      var sumByProperty = sumByProperty;
      var calcDuration = calcDuration;
      var addTime = addTime;
      var substractTime = substractTime;

      var getIndexOfTimespan = getIndexOfTimespan;

      // data validation
      var setValidationMessage = setValidationMessage;
      var initValidation = initValidation;


      initValidation();

      //////////////////////////////////////////////////////////////////////
      function hide() {
        $mdDialog.hide();
      }

      function cancel() {
        $mdDialog.cancel();
        vm.getTasks();//from parent controller
      }

      function answer(answer) {
        $mdDialog.hide(answer);
      }

      function removeTimeSpan(index) {
        self.task.history.splice(index, 1);
        self.task.duration = sumByProperty(self.task.history, 'dt');
      }

      function save(item) {
        console.log('EditDialogController:  save task clicked');
        return dataservice.editTask(item)
                .then(function(data) {
                  self.hide();
                  return data;
                })
                .then(function(data) {
                  vm.getTasks(); //from parent controller
                });
      }

      function initInterval(fn) {
        if (!interval) {
         interval = $interval(function() {
             fn();
         }, ms);
       }
      }

      function cancelInterval() {
        if(interval) {
          $timeout (function() {
            $interval.cancel(interval);
            interval = null;
          }, ms);
        }
      }

      function addHour(item, property) {
        ms=200;
        self.initInterval( function() {
          addTime(item, property, 'HH'); //interval execution
        });

      }

      function substractHour(item, property) {
        ms=200;
        self.initInterval( function() {
          substractTime(item, property, 'HH');
        });
      }

      function addMinute(item, property) {
        ms=150;
        self.initInterval( function() {
            addTime(item, property, 'mm');
        });
      }

      function substractMinute(item, property) {
        ms=150;
        self.initInterval( function() {
            substractTime(item, property, 'mm');
        });
      }
      /*
      Internal use functions
      */
      function addTime(item, property, timeProperty) {
        var tmp = new Date(item[property]);

        if (timeProperty === 'HH') {
          tmp.setHours(tmp.getHours() + 1);
        }
        if (timeProperty === "mm") {
          tmp.setMinutes(tmp.getMinutes() + 1);
        }

        item[property] = tmp.toISOString();
        item.dt = calcDuration(item);
        self.task.duration = sumByProperty(self.task.history, 'dt');
      }

      function substractTime(item, property, timeProperty) {
          var tmp = new Date(item[property]);
          if (timeProperty === 'HH') {
            tmp.setHours(tmp.getHours() - 1);
          }
          if (timeProperty === "mm") {
            tmp.setMinutes(tmp.getMinutes() - 1);
          }

          item[property] = tmp.toISOString();
          item.dt = calcDuration(item);
          self.task.duration = sumByProperty(self.task.history, 'dt');

      }

      function sumByProperty(items, property) {

        if (items === 0) return 0;

        return items.reduce(function(previous, current) {
          return current[property] === null ? previous : previous + parseFloat(current[property]);
        }, 0)
      }

      function calcDuration(item){
        var start = new Date(item.startTime);
        var stop = new Date(item.stopTime);
        var isValid = isValidTimeSpan(item);

        initValidation();
        if (isValid) {
          setValidationMessage("", false);
          return (stop.getTime() - start.getTime()) / 1000;
        } else {
          setValidationMessage("Sprawdź czy próbki na siebie nie nachodzą.");
          return item.dt;
        }

      }


    function isValidTimeSpan(item) {
      var start = new Date(item.startTime);
      var stop  = new Date(item.stopTime);
      //check current item
      if (start.getTime() > stop.getTime()) { console.log('starTime większy od stopTime'); return false; }
      if (stop.getTime() > new Date().getTime() ) { console.log('stopTime większy od aktualnego czasu'); return false; } // gt than current Time
      if (stop.getDate() > start.getDate() || start.getDate() > stop.getDate()) { console.log('Odcinek czasu posiada rożne daty'); return false; } //different days

      // compare timespan with previous/next timespan
      var history     = self.task.history;
      var index       = getIndexOfTimespan(item);
      var currentItem = history[index];
      console.log('index:' + index + ' - ' + self.task.history[index]);

      if (index === undefined || index === null || index === -1) {
         console.log('Item undefined, null or -1');
         return false;
      }

      //check middle items
      if (index > 0 && index < history.length - 2) {
              var previousItem = history[index + 1];
              var nextItem     = history[index - 1];
              console.group('Środkowy element tabeli');
              console.log('nextItem');
              console.log(nextItem);
              console.log('currentItem');
              console.log(currentItem);
              console.log('previousItem');
              console.log(previousItem);
              console.log('currentIndex: ' + index)

              if (new Date(previousItem.stopTime).getTime() > new Date(currentItem.startTime).getTime() ) {
                  console.log('Poprzedni stopTime większy od startTime bieżacego elementu');
                  console.log('previousItem: ' + previousItem._id + ' ' + new Date(previousItem.stopTime).getTime() );
                  console.log('currentItem: ' + + currentItem._id + '' + new Date(currentItem.startTime).getTime() );
                  return false;
              }

              if ( new Date(currentItem.stopTime).getTime() > new Date(nextItem.startTime).getTime()) {
                  console.log('stopTime bieżacego elementu większy od starTime następnego elementu');
                  return false;
              }
              console.groupEnd();
      }
      if (index === 0 && history.length > 1) {
              var previousItem = history[index + 1];
              console.group('Pierwszy element tabeli');
              if (new Date(previousItem.stopTime).getTime() > new Date(currentItem.startTime).getTime()) {
                  console.log('Poprzedni stopTime większy od startTime bieżacego elementu');
                  return false;
              }
              console.groupEnd();
      }

      if (index === history.length-1 && history.length > 1 ) {
        console.group('Ostatni element tabeli');
        var nextItem = history[index-1];
        if ( new Date(currentItem.stopTime).getTime() > new Date(nextItem.startTime).getTime() ) {
            console.log('nextItem');
            console.log(nextItem);
            console.log('stopTime: ' + new Date(nextItem.stopTime).getTime() )
            console.log('currentItem');
            console.log(currentItem);
            console.log('startTime: ' + new Date(currentItem.startTime).getTime() )
            console.log('Ostatni element stopTime większy od starTime następnego elementu');
            console.log('index: ' + index);
            return false;
        }
        console.groupEnd();
      }

      return true;
    }// #isValidTimeSpan

    function initValidation() {
        var history = self.task.history;
        var len = history.length;
        console.log('Validate ' + len + ' objects');

        for (var i = 0; i < len; i++) {

          if (!isValidTimeSpan(history[i])) {
            self.task.history[i].isValid = false;
          } else {
            self.task.history[i].isValid = true;
          }

        }
        console.log('Validation end');
        console.log(self.task.history);
    }


    function getIndexOfTimespan(item) {
      var index = self.task.history.map(function(e) { return e._id; }).indexOf(item._id);
      return index;
    }

    function setValidationMessage(message, error = true) {
        self.task.history.isValid.message = message || {};
        self.task.history.isValid.error   = error || {};
    }

    }// #EditDialogController


  }// #DashboardController
})();

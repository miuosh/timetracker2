(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */
  DashboardController.$inject = ['$scope', '$interval', '$mdToast', 'dataservice', ];
  /*
  1. dodać funkcję odliczania czasu - done
  2. sformatować tabele
  3. zrobić stronicowanie
  4. filtrowanie po kolumnie
  5. filtrowanie po kategorii
  6. wyszukiwanie
  7. możliwość wczytania predefiniowanych kategorii
  8. dodać menu - usuń, status: zakończone
  */

  function DashboardController($scope, $interval, $mdToast, dataservice ) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};
    vm.intervalsID = [];
    vm.newTask = {};

    vm.addTask = addTask;
    vm.removeTasks = removeTasks;
    vm.toggleTask = toggleTask;
    vm.startTimer = startTimer;
    vm.stopTimer = stopTimer;

    vm.countDuration = countDuration;
//    Testing
//     vm.tasks = [
//   { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
//   { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 },
//   { "_id" : "57fcf2b2c5798b1024f32f52", "desc" : "trzecie zadanie", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:54.349Z", "creationDate" : "2016-10-11T14:09:54.349Z", "__v" : 0 },
//   { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
//   { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 },
//   { "_id" : "57fcf2b2c5798b1024f32f52", "desc" : "trzecie zadanie", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:54.349Z", "creationDate" : "2016-10-11T14:09:54.349Z", "__v" : 0 },
//   { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
//   { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 }
// ]

    console.log('Init Dashboard Controller');
    loadTasks();
    initEvents();
    /////////////////////

    function loadTasks() {
      return getTasks().then(function(data) {
        console.log('Loading tasks...');
        return data;
      })
      .catch(function(err) {
        console.log('Error');
        console.log(err.message);
      })

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
          })
  }// #getTasks

    function addTask(task) {
      return dataservice.addTask(task)
              .then(function(data) {

                if(angular.isArray(vm.tasks)) {
                  if(data.status === 200) {
                    console.log('New task');
                    vm.tasks.unshift(data)
                  } else {
                    $mdToast.showSimple(data.data.message);
                  }
                  return vm.tasks;
                }
              })
              .then(function(data) {
                //clear new task fields
                vm.newTask = angular.copy({});
                $scope.newTaskForm.$setPristine();
                $scope.newTaskForm.$setUntouched();
              })
              .catch(function(err) {
                console.log('error: ' + err.message);
              })
    }

    function removeTasks(id) {
      var ids = getSelectedTasks();
      return dataservice.removeTasks(ids)
                .then(getTasks);
    }

    function getSelectedTasks() {
      var ids = [];
      var len = vm.tasks.length
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
      }, 1000)

      var taskID = item._id;
      vm.intervalsID.push({ intervalPromise, taskID });
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
      })
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



  }
})();

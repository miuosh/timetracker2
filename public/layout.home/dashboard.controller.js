(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */
  DashboardController.$inject = ['$scope', '$interval', 'dataservice'];
  /*
  1. dodać funkcję odliczania czasu
  2. sformatować tabele
  3. zrobić stronicowanie
  4. filtrowanie po kolumnie
  5. filtrowanie po kategorii
  6. wyszukiwanie
  7. możliwość wczytania predefiniowanych kategorii
  8. dodać menu - usuń, status: zakończone
  */

  function DashboardController($scope, $interval, dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};
    vm.intervalsID = [];

    vm.addTask = addTask;
    vm.removeTasks = removeTasks;
    vm.toggleTask = toggleTask;
    vm.startTimer = startTimer;
    vm.stopTimer = stopTimer;

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
      return getTasks().then(function() {
        console.log('Loading tasks...');
      })
    }// #loadTasks

////////////////////////////////////////////////////////
    function getTasks(){
      return dataservice.getTasks()
          .then(function(data) {
            vm.tasks = data;
            return vm.tasks;
          })
    }

    function addTask(task) {
      return dataservice.addTask(task)
              .then(function(data) {
                if(angular.isArray(vm.tasks)) {
                  vm.tasks.unshift(data)
                  console.log(vm.tasks);
                  return vm.tasks;
                }
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
      console.log(item);
      return dataservice.toggleTask(item._id)
                .then(function(data) {
                  console.log(data);
                  return data;
                }).then(function(data) {
                  return getTasks();
                });

    }// #toogleTask

    function startTimer(item) {
      var intervalPromise = $interval(function() {
        item.duration++;
        console.log('tick');
      }, 1000)

      var taskID = item._id;
      vm.intervalsID.push({ intervalPromise, taskID });
    } // #startTimer

    function stopTimer() {
      var len = vm.intervalsID.length;
        for (var i = len; i-- ;  ) {
            if (vm.intervalsID[i].taskID === item._id){
                $interval.cancel(vm.intervalsID[i].promiseID);
                $scope.intervalsID.splice(i, 1);
            }
        }
    }// #stopTimer

    function initEvents() {
      $scope.$on('$destroy', function() {
        vm.stopTimer();
        console.log('DashboardController scope destroyed.');
      })
    }



  }
})();

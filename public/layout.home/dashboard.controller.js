(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */
  DashboardController.$inject = ['$scope', '$interval','$mdDialog', 'dataservice'];
  /*
  1. dodać funkcję odliczania czasu - done
  2. sformatować tabele- done
  3. zrobić stronicowanie
  4. filtrowanie po kolumnie
  5. filtrowanie po kategorii
  6. wyszukiwanie
  7. możliwość wczytania predefiniowanych kategorii
  8. dodać menu - usuń, status: ukończone - done
  */

  function DashboardController($scope, $interval, $mdDialog, dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};
    vm.intervalsID = [];

    vm.removeTasks = removeTasks;
    vm.toggleTask = toggleTask;
    vm.setAsCompleted = setAsCompleted;
    vm.startTimer = startTimer;
    vm.stopTimer = stopTimer;

    vm.countDuration = countDuration;

    // filter table
    vm.sort = sort;
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


    function sort(property) {

    }

    function compare(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }

  }// #DashboardController
})();

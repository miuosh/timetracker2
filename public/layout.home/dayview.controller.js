(function() {
  'use strict';
  angular.module('app.layout')
  .controller('DayViewController', DayViewController);

  /* @ngInject */

  DayViewController.$inject = ['$scope', '$mdDialog', 'dataservice'];

  function DayViewController($scope, $mdDialog, dataservice) {
    var vm = this;
    vm.tasksInDay = [];
    vm.tasks = []; // input data
    vm.filteredTasks = [];
    vm.tasksInDay.duration = 0;

    vm.viewDate = new Date();
    vm.viewDate.setHours(0);
    vm.viewDate.setMinutes(0);
    vm.viewDate.setSeconds(0);
    vm.viewDate.setMilliseconds(0);
    console.log('Init DayViewController...');
    vm.getTasksByDate = getTasksByDate;
    vm.prevDay = prevDay;
    vm.nextDay = nextDay;

    // filter table
    $scope.sortType = 'timespan.startTime';
    $scope.sortReverse = true;
    $scope.searchType = '';

    //edit task dialog
    vm.openEditDialog = openEditDialog;

    // edit model
    vm.editTaskHistoryItem = editTaskHistoryItem;

    /* internal functions */
    var sumByProperty = sumByProperty;
    var filterHistory = filterHistory;
    var makeDaySchedule = makeDaySchedule;
    var isCurrentDayTimespan = isCurrentDayTimespan;
    var calculateSummaryTime = calculateSummaryTime;


    init();
  /////////////////////////////////////////////////////////////////////////////

  function init() {
      getTasksByDate(vm.viewDate);

  }

  function openEditDialog(ev, item) {
    console.log('OpenEditDialog: item: \n');
    console.log(item);
    return dataservice.getTask(item._id)
      .then(function(data) {
        console.log('Received data: ');
        console.log(data);

        $mdDialog.show({
          locals: {
            task: data[0]
          },
          controller: 'DialogTaskEditController',
          controllerAs: 'edc',
          templateUrl: '/layout.home/dialog.task.edit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true
        })
        .then(function(answer) {
          console.log('Dialog OK: ' + answer);
          getTasksByDate(vm.viewDate);
        }, function(){
          console.log('Cancel dialog.');
        });
      })
      .catch(function(err) {
        console.log(err);
      });
    }

    function getTasksByDate(date) {
      return dataservice.getTasksByDate(date.getTime())
        .then(function(data) {
          vm.tasks = data;
          console.log(data);

        })
        .then(filterHistory)
        .then(makeDaySchedule)
        .then(calculateSummaryTime);
    }

    function prevDay() {
      vm.viewDate.setDate(vm.viewDate.getDate() - 1);
      init();
    }

    function nextDay() {
      vm.viewDate.setDate(vm.viewDate.getDate() + 1);
      init();
    }

    function editTaskHistoryItem(item) {
      return dataservice.editTaskHistoryItem(item)
              .then(function(data) {
                init();
              })
    }
    function filterHistory() {
      var length = vm.tasks.length;
      vm.filteredTasks = vm.tasks;

      for (var i = 0; i < length; i++) {
        vm.filteredTasks[i].history = vm.filteredTasks[i].history.filter(isCurrentDayTimespan);
      }
      console.log(vm.filteredTasks)
    }

    function isCurrentDayTimespan(timespan) {
      var startTime = new Date(timespan.startTime);
      if (startTime.getTime() > vm.viewDate.getTime()) return timespan;
    }


    function makeDaySchedule() {
      vm.tasksInDay = vm.filteredTasks;
      var tmp = [];
      var length = vm.filteredTasks.length;

      for (var i = 0; i < length; i++) {
          for(var j = 0; j < vm.filteredTasks[i].history.length; j++) {
            tmp.push({
              _id : vm.filteredTasks[i]._id,
              desc: vm.filteredTasks[i].desc,
              isCompleted: vm.filteredTasks[i].isCompleted,
              timespan: vm.filteredTasks[i].history[j],
              duration: vm.filteredTasks[i].history[j].dt,
            });
          }
      }
      console.log(tmp)
      vm.tasksInDay = tmp;
    }

    function calculateSummaryTime() {
      vm.tasksInDay.duration = sumByProperty(vm.tasksInDay, 'duration');
      console.log(vm.tasksInDay.duration);
    }

    function sumByProperty(items, property) {
      console.log()
      if (items === 0) return 0;

      return items.reduce(function(previous, current) {
        return current[property] === null ? previous : previous + parseFloat(current[property]);
      }, 0)
    }

  }// #DayViewController

}());

(function() {
  'use strict';
  angular.module('app.layout')
  .controller('DayViewController', DayViewController);

  /* @ngInject */

  DayViewController.$inject = ['$scope', '$mdDialog', '$mdToast', 'dataservice'];

  function DayViewController($scope, $mdDialog, $mdToast, dataservice) {
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
    $scope.sortType = '';
    $scope.sortReverse = true;
    $scope.searchType = '';

    // edit model
    $scope.edit = false;

    /* timespan edition  */
    vm.cancelEdit = cancelEdit;
    vm.saveChanges = saveChanges;
    vm.editMode = editMode;
    vm.removeItem = removeItem;
    vm.dayViewChanged = dayViewChanged;

    /* validation */
    vm.isValid = true;

    /* internal functions */
    var sumByProperty = sumByProperty;
    var filterHistory = filterHistory;
    var makeDaySchedule = makeDaySchedule;
    var isCurrentDayTimespan = isCurrentDayTimespan;
    var calculateSummaryTime = calculateSummaryTime;
    var updateDuration = updateDuration;
    var checkValidity = checkValidity;

    init();
  /////////////////////////////////////////////////////////////////////////////

  function init() {
      getTasksByDate(vm.viewDate);

  }

  function dayViewChanged(timespanId) {
    console.log('DayViewController - dayViewChanged....');
    console.log(timespanId);
    checkValidity(timespanId);
    updateDuration();
    calculateSummaryTime();
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


    function filterHistory() {
      var length = vm.tasks.length;
      vm.filteredTasks = vm.tasks;

      for (var i = 0; i < length; i++) {
        vm.filteredTasks[i].history = vm.filteredTasks[i].history.filter(isCurrentDayTimespan);
      }
    }

    function isCurrentDayTimespan(timespan) {
      var startTime = new Date(timespan.startTime);
      if (startTime.getDate() === vm.viewDate.getDate()) return timespan;
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
              duration: vm.filteredTasks[i].history[j].dt
            });
          }
      }
      vm.tasksInDay = tmp;
    }


    function calculateSummaryTime() {
      vm.tasksInDay.duration = sumByProperty(vm.tasksInDay, 'duration');
      console.log(vm.tasksInDay.duration);
    }

    function sumByProperty(items, property) {
      if (items === 0) return 0;
      return items.reduce(function(previous, current) {
        return current[property] === null ? previous : previous + parseFloat(current[property]);
      }, 0)
    }

    function updateDuration() {
      // update item duration to calculateSummaryTime by duration property
      vm.tasksInDay.forEach(elem => {
          elem.duration = elem.timespan.dt;
      });
    }

    function checkValidity(timespanId) {
      var timespans = vm.tasksInDay;
      var index = timespans.findIndex(element => element.timespan._id === timespanId);

      vm.tasksInDay[index].timespan.isValid = isSameDay(timespans[index].timespan.startTime, timespans[index].timespan.stopTime) ||
        isStartTimestampGreater(timespans[index].timespan.startTime, timespans[index].timespan.stopTime);
    }

    function isSameDay(startTimestamp, stopTimestamp) {
      var time0 = new Date(startTimestamp);
      var time1 = new Date(stopTimestamp);
      return time0.getDate() === time1.getDate();
    }

    function isStartTimestampGreater(startTimestamp, stopTimestamp) {
      return time0.getTime() > time1.getTime();
    }



    /* taks edition */

    function cancelEdit() {
      init();
    }

    function editMode() {

    }

    function saveChanges(timespan) {
      console.log('Saving timespan... ');
      console.log();
      return dataservice.editTaskHistoryItem(timespan)
                          .then(function(data) {
                            console.log(data);
                            $mdToast.show(
                              $mdToast.simple()
                              .textContent(data)
                              .position('top right')
                            );
                          })
                          .catch(function(err) {
                            console.log(err);;
                          })
    }

    function removeItem(ev, id) {
      /* Confirm remove tasks */

         // Appending dialog to document.body to cover sidenav in docs app
         var confirm = $mdDialog.confirm()
               .title('Czy na pewno usunąć?')
               .textContent('')
               .ariaLabel('Usuń zadania')
               .targetEvent(ev)
               .ok('Tak, usuń')
               .cancel('Anuluj');

         $mdDialog.show(confirm).then(function() {
           console.log('usuwanie');
           return dataservice.removeTaskHistoryItem(id)
                    .then(function(data) {
                      console.log(data);
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent(data)
                        .position('top right')
                      );
                      init();
                    })
         }, function() {
           console.log('Anulowano usuwanie');
         });
    }
  }// #DayViewController

}());

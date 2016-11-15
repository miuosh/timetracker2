(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */

  function DashboardController(dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};

    vm.addTask = addTask;
    vm.removeTasks = removeTasks;
    vm.toggleTask = toogleTask;

  //  Testing
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

console.log(vm.tasks);
    loadTasks();
    /////////////////////

    function loadTasks() {
      return getTasks().then(function() {
        console.log('Loading tasks...');
      })
    }

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


    function toogleTask(id) {
      return dataservice.toggleTask(id)
                .then(function(data) {
                  if (angular.isArray(vm.tasks)) {
                    //toggle tasks
                    return vm.tasks;
                  }
                })
    }



  }
})();

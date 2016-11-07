(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */

  function DashboardController(dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};
    // Testing
    vm.tasks = [
  { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
  { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 },
  { "_id" : "57fcf2b2c5798b1024f32f52", "desc" : "trzecie zadanie", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:54.349Z", "creationDate" : "2016-10-11T14:09:54.349Z", "__v" : 0 },
  { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
  { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 },
  { "_id" : "57fcf2b2c5798b1024f32f52", "desc" : "trzecie zadanie", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:54.349Z", "creationDate" : "2016-10-11T14:09:54.349Z", "__v" : 0 },
  { "_id" : "57fcf254c5798b1024f32f50", "desc" : "nowe zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:08:20.388Z", "creationDate" : "2016-10-11T14:08:20.388Z" , "__v" : 0 },
  { "_id" : "57fcf2a6c5798b1024f32f51", "desc" : "drugie zadanie użytkownika test2", "category" : "brak", "_creator" : "57fba6b4ed88582af063aa19", "isPerforming" : false, "updated" : "2016-10-11T14:09:42.827Z", "creationDate" : "2016-10-11T14:09:42.827Z" , "__v" : 0 }
]
console.log(vm.tasks);
    //loadTasks();
    //loadTask();
    /////////////////////

    function loadTasks() {
      return getTasks().then(function() {
        console.log('Loading tasks...');
      })
    }

    function loadTask() {
      return getTask('123').then(function() {
        console.log('Loading task...')
      })
    }
    /////////////////////
    function getTasks(){
      return dataservice.getTasks()
          .then(function(data) {
            vm.tasks = data;
            return vm.tasks;
          })
    }

    function getTask(id) {
      return dataservice.getTask(id)
          .then(function(data) {


          })
    }



  }
})();

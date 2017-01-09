(function(){
  'use strict';

  angular.module('app.layout')
  .controller('AddTaskController', AddTaskController);

  AddTaskController.$inject = ['$scope', '$log', 'dataservice'];

  function AddTaskController($scope, $log, dataservice) {

    $scope.newTaskForm = {};

    var vm = this;
    vm.newTask = {};
    vm.addTask = addTask;

   // Autocomplete profile
   vm.profile = [];

   // autocomplete projects
   vm.projects =  vm.profile.projects;
   vm.searchProject = '';
   vm.selectedProjectChange = selectedProjectChange;
   vm.searchProjectChange   = searchProjectChange;

   // autocomplete categories
   vm.categories =  vm.profile.categories;
   vm.searchCategory = '';
   vm.selectedCategoryChange = selectedCategoryChange;
   vm.searchCategoryChange   = searchCategoryChange;

   /*
   init events and load data
   */
   init();

////////////////////////////////////////////////////////////////////////////////
    function init() {
      console.log('Init AddTaskController');
      loadProfileData();
    }


    function addTask(task) {
      console.log(task);
      return dataservice.addTask(task)
              .then(function(data) {
                  // pass data to DashboardController by emit event
                  console.log(data);
                  if(!data.status) {
                    $scope.$emit('addNewTask', data);
                  }
                  return data;
                })
              .then(function(data) {
                //clear new task fields
                angular.copy({}, vm.newTask);
                vm.searchCategory = null;
                vm.searchProject = null;
                $scope.newTaskForm.$setPristine();
                $scope.newTaskForm.$setUntouched();


              });
    }

    function loadProfileData() {
      return dataservice.getUserSettings()
              .then(function(data) {
                return dataservice.getProfile(data.profile);
              })
              .then(function(data) {
                if(data[0] !== undefined) {
                  vm.profile = data[0];
                  return data[0];
                } else {
                  vm.profile.categories = [];
                  vm.profile.projects = [];
                  return data;
                }
              });
    }// #loadProfileData

    function searchProjectChange(text) {
      //$log.info('Text changed to ' + text);
      // comment newTask.project = text - user must selected project
      //vm.newTask.project = text;
    }

    function selectedProjectChange(item) {
      //$log.info('Item changed to ' + JSON.stringify(item));
      vm.newTask.project = item;
    }

    function searchCategoryChange(text) {
      //$log.info('Text changed to ' + text);
      // comment newTask.category - user must select category
      //vm.newTask.category = text;
    }

    function selectedCategoryChange(item) {
      //$log.info('Item changed to ' + JSON.stringify(item));
      vm.newTask.category = item;
    }

  }// #AddTaskController
})();

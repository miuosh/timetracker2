(function(){
  'use strict';

  angular.module('app.layout')
  .controller('AddTaskController', AddTaskController);

  AddTaskController.$inject = ['$scope', '$log', 'dataservice'];

  function AddTaskController($scope, $log, dataservice) {
    var vm = this;
    //vm.projects = loadProjects();
  //  vm.categories = loadCategories();
    vm.newTask = {};
    vm.addTask = addTask;
    $scope.newTaskForm = {};

    // autocomplete model
    vm.profile = {
        "name": "profil1",
        "projects": ["TelWin", "TelNOM"],
        "categories": ["Instalacja", "Konfiguracja", "Poprawka", "Testy"]
      };


    function init() {
      console.log('Init AddTaskCtrl');
    }


    function addTask(task) {
      return dataservice.addTask(task)
              .then(function(data) {
                  // pass data to DashboardController through event
                  $scope.$emit('addNewTask', data);
                  return data;
                })
              .then(function(data) {
                //clear new task fields
                vm.newTask = angular.copy({});
                //$scope.newTaskForm.$setPristine();
                //$scope.newTaskForm.$setUntouched();
              });
    }


  }// #AddTaskController
})();

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


    self.simulateQuery = false;
    self.isDisabled    = false;

////////////////////////////////////////////////////////////////////////////////
   // my test data
   self.profile = {
       "name": "profil1",
       "projects": ["TelWin", "TelNOM"],
       "categories": ["Instalacja", "Konfiguracja", "Poprawka", "Testy"]
     };

   self.categories =  ["Instalacja", "Konfiguracja", "Poprawka", "Testy"];



    init();
////////////////////////////////////////////////////////////////////////////////
    function init() {
      console.log('Init AddTaskController');

      $scope.$on('categoryChanged', function(event, data) {
        vm.newTask.category = data;
      })
    }


    function addTask(task) {
      return dataservice.addTask(task)
              .then(function(data) {
                  // pass data to DashboardController by emit event
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

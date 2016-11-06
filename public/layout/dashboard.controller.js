(function(){
  'use strict';

  angular.module('app.layout')
  .controller('DashboardController', DashboardController);

  /* @ngInject */

  function DashboardController(dataservice) {
    var vm = this;
    vm.name = "DashboardController";
    vm.tasks = {};

    loadTasks();
    /////////////////////

    function loadTasks() {
      return getTasks().then(function() {
        console.log('Loading tasks...');
      })
    }

    function getTasks(){
      return dataservice.getTasks()
    }




  }
})();

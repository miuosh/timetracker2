/* IIFE - Immediately Invoked Function Expression
 without IIFE i.e. function SideNavController() is defined as global variable
*/
(function(){
  'use strict';

  angular.module('app.layout')
  .controller('ReportController', ReportController);

  /* @ngInject */
  ReportController.$inject = ['$scope', 'dataservice'];
  function ReportController($scope, dataservice) {
    var vm = this;
    vm.name = "ReportController";
    vm.tasks = {};

    init();

    //////////////////////////////////

    function init() {
      loadTasks();
    }

    function loadTasks() {
      return dataservice.getTasks()
        .then(function(data) {
          vm.tasks = data;
          return data;
        })
        .catch(function(err) {
          console.log(err);
        })
    }
  }// #ReportController

})();
